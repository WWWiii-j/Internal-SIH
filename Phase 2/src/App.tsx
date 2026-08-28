import React, { useState } from 'react';
import {
  ConsultationDataset,
  IngestionProcessingState,
  IngestionStep,
  SchemaMappingConfig,
} from './types';
import { ingestConsultationDataset } from './services/dataIngestionService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { ConsultationUploader } from './components/upload/ConsultationUploader';
import { ProcessingScreen } from './components/upload/ProcessingScreen';
import { DatasetOverviewPanel } from './components/overview/DatasetOverviewPanel';
import confetti from 'canvas-confetti';

export function App() {
  const [dataset, setDataset] = useState<ConsultationDataset | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingState, setProcessingState] = useState<IngestionProcessingState>({
    currentStep: 'uploading',
    progress: 0,
    statusMessage: 'Ready',
    completedSteps: [],
  });

  const [activeFileName, setActiveFileName] = useState<string>('');
  const [totalSubmissionsCount, setTotalSubmissionsCount] = useState<number>(0);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleStartIngestion = async (
    fileName: string,
    rawRows: Record<string, string>[],
    mappingConfig: SchemaMappingConfig,
    title?: string
  ) => {
    setActiveFileName(fileName);
    setTotalSubmissionsCount(rawRows.length);
    setIsProcessing(true);

    const completed: IngestionStep[] = [];

    // Step 1: Uploading
    setProcessingState({
      currentStep: 'uploading',
      progress: 15,
      statusMessage: 'Reading dataset buffer into local memory stream...',
      completedSteps: completed,
    });
    await sleep(200);
    completed.push('uploading');

    // Step 2: Parsing
    setProcessingState({
      currentStep: 'parsing',
      progress: 35,
      statusMessage: `Sniffing CSV delimiters & verifying ${rawRows.length} tabular rows...`,
      completedSteps: completed,
    });
    await sleep(200);
    completed.push('parsing');

    // Step 3: Schema Detecting
    setProcessingState({
      currentStep: 'schema_detecting',
      progress: 55,
      statusMessage: `Mapping semantic role for comment column "${mappingConfig.commentColumn}"...`,
      completedSteps: completed,
    });
    await sleep(200);
    completed.push('schema_detecting');

    // Step 4: Cleaning & Normalizing
    setProcessingState({
      currentStep: 'cleaning_normalizing',
      progress: 75,
      statusMessage: 'Sanitizing text controls, stripping HTML, & detecting duplicate submissions...',
      completedSteps: completed,
    });
    const ingested = ingestConsultationDataset(fileName, rawRows, mappingConfig, title);
    await sleep(250);
    completed.push('cleaning_normalizing');

    // Step 5: Dynamic Topics & Priority Engine (Phase 2B + 2C)
    setProcessingState({
      currentStep: 'diagnostics_computing',
      progress: 90,
      statusMessage: 'Discovering dynamic topics & computing explainable priority scores...',
      completedSteps: completed,
    });
    await sleep(200);
    completed.push('diagnostics_computing');

    // Step 6: Ready
    setProcessingState({
      currentStep: 'ready',
      progress: 100,
      statusMessage: 'Consultation dataset normalized & ready for analysis!',
      completedSteps: completed,
    });
    await sleep(150);

    setDataset(ingested);
    setIsProcessing(false);

    // Confetti celebration
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleUpdateMapping = (newMapping: SchemaMappingConfig) => {
    if (!dataset) return;
    const reIngested = ingestConsultationDataset(
      dataset.fileName,
      dataset.rawRows,
      newMapping,
      dataset.title
    );
    setDataset(reIngested);
  };

  const handleReset = () => {
    setDataset(null);
    setIsProcessing(false);
    setActiveFileName('');
    setTotalSubmissionsCount(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-earth-900 font-sans selection:bg-forest-800 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        dataset={dataset}
        onReset={handleReset}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* State 1: Ingestion Loading Animation */}
        {isProcessing && (
          <ProcessingScreen
            state={processingState}
            totalCommentsCount={totalSubmissionsCount}
            fileName={activeFileName}
          />
        )}

        {/* State 2: Consultation Dataset Uploader */}
        {!isProcessing && !dataset && (
          <ConsultationUploader onIngestDataset={handleStartIngestion} />
        )}

        {/* State 3: Normalized Dataset Overview & Explorer */}
        {!isProcessing && dataset && (
          <DatasetOverviewPanel
            dataset={dataset}
            onReset={handleReset}
            onUpdateMapping={handleUpdateMapping}
          />
        )}
      </main>

      {/* Architecture & Verification Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
