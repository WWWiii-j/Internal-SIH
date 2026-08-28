import { useState } from 'react';
import {
  AnalysisResult,
  CommentRecord,
  ProcessingState,
  ProcessingStep,
} from './types';
import { processRawComments, computeGlobalKeywordMetrics } from './services/nlpEngine';
import { computeAnalysisStatistics } from './services/summaryGenerator';
import { enhanceSummaryWithAi } from './services/aiService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { CsvUploader } from './components/upload/CsvUploader';
import { ProcessingScreen } from './components/upload/ProcessingScreen';
import { KpiCards } from './components/dashboard/KpiCards';
import { ExecutiveSummary } from './components/dashboard/ExecutiveSummary';
import { SentimentCharts } from './components/dashboard/SentimentCharts';
import { KeywordAnalytics } from './components/dashboard/KeywordAnalytics';
import { InsightsCards } from './components/dashboard/InsightsCards';
import { CommentsTable } from './components/dashboard/CommentsTable';
import { ExportDropdown } from './components/dashboard/ExportDropdown';
import { FileSpreadsheet, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    currentStep: 'uploading',
    progress: 0,
    statusMessage: 'Ready',
    completedSteps: [],
  });

  const [activeFileName, setActiveFileName] = useState<string>('');
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [selectedModalComment, setSelectedModalComment] = useState<CommentRecord | null>(null);

  // Modals
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Delay helper for smooth step transitions
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleStartAnalysis = async (
    _fileOrContent: File | string,
    fileName: string,
    rawRows: Record<string, string>[],
    commentColumn: string
  ) => {
    setActiveFileName(fileName);
    setTotalCommentsCount(rawRows.length);
    setIsProcessing(true);
    setSelectedKeyword(null);

    // Multi-stage visual pipeline execution
    const completed: ProcessingStep[] = [];

    // Step 1: Uploading
    setProcessingState({
      currentStep: 'uploading',
      progress: 15,
      statusMessage: 'Reading dataset buffer into local stream memory...',
      completedSteps: completed,
    });
    await sleep(200);
    completed.push('uploading');

    // Step 2: Validating
    setProcessingState({
      currentStep: 'validating',
      progress: 30,
      statusMessage: `Validated schema with feedback column "${commentColumn}"`,
      completedSteps: completed,
    });
    await sleep(200);
    completed.push('validating');

    // Step 3: Extracting
    setProcessingState({
      currentStep: 'extracting',
      progress: 45,
      statusMessage: `Segmenting ${rawRows.length} stakeholder submissions...`,
      completedSteps: completed,
    });
    await sleep(200);
    completed.push('extracting');

    // Step 4: Sentiment Analysis
    setProcessingState({
      currentStep: 'sentiment',
      progress: 65,
      statusMessage: 'Evaluating multi-clause VADER polarity & confidence scores...',
      completedSteps: completed,
    });
    const records = processRawComments(rawRows, commentColumn);
    await sleep(250);
    completed.push('sentiment');

    // Step 5: Keyword & Theme Extraction
    setProcessingState({
      currentStep: 'keywords',
      progress: 80,
      statusMessage: 'Computing N-gram term frequencies & recurring governance themes...',
      completedSteps: completed,
    });
    const { keywords, themes } = computeGlobalKeywordMetrics(records);
    const stats = computeAnalysisStatistics(records);
    await sleep(200);
    completed.push('keywords');

    // Step 6: Summary Generation
    setProcessingState({
      currentStep: 'summary',
      progress: 92,
      statusMessage: 'Synthesizing executive briefing & policy recommendations...',
      completedSteps: completed,
    });
    const summary = await enhanceSummaryWithAi(records, stats, keywords, themes);
    await sleep(250);
    completed.push('summary');

    // Step 7: Preparing Dashboard
    setProcessingState({
      currentStep: 'ready',
      progress: 100,
      statusMessage: 'Analytics dossier ready!',
      completedSteps: completed,
    });
    await sleep(150);

    // Save final state
    const detectedColumns = rawRows.length > 0 ? Object.keys(rawRows[0]) : [];
    const finalResult: AnalysisResult = {
      fileName,
      analyzedAt: new Date().toLocaleString(),
      records,
      stats,
      keywords,
      themes,
      summary,
      rawColumns: detectedColumns,
      selectedCommentColumn: commentColumn,
    };

    setAnalysisResult(finalResult);
    setIsProcessing(false);

    // Confetti celebration on completion
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.6 },
    });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsProcessing(false);
    setSelectedKeyword(null);
    setSelectedModalComment(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-earth-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        hasActiveAnalysis={!!analysisResult}
        onReset={handleReset}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onOpenApiSettings={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* State 1: In Progress Loading Screen */}
        {isProcessing && (
          <ProcessingScreen
            state={processingState}
            totalCommentsCount={totalCommentsCount}
            fileName={activeFileName}
          />
        )}

        {/* State 2: Upload Screen */}
        {!isProcessing && !analysisResult && (
          <CsvUploader onFileValidated={handleStartAnalysis} />
        )}

        {/* State 3: Interactive Dashboard */}
        {!isProcessing && analysisResult && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
            {/* Dashboard Header Strip */}
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2.5">
                  <span className="p-1.5 rounded-lg bg-forest-100 text-forest-800 border border-forest-300">
                    <FileSpreadsheet className="w-5 h-5" />
                  </span>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-forest-950">
                    {analysisResult.fileName}
                  </h2>
                  <span className="text-[11px] font-semibold bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded border border-forest-300">
                    Analysis Complete
                  </span>
                </div>
                <p className="text-xs text-earth-600">
                  Synthesized <span className="font-semibold text-earth-900">{analysisResult.stats.totalComments}</span> stakeholder submissions from column{' '}
                  <code className="bg-sand-100 px-1.5 py-0.5 rounded text-earth-800 font-semibold border border-sand-300">
                    "{analysisResult.selectedCommentColumn}"
                  </code>{' '}
                  · Generated on {analysisResult.analyzedAt}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-sand-300 bg-white hover:bg-sand-100 text-earth-800 text-xs font-semibold transition-colors shadow-subtle focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-earth-600" />
                  <span>Analyze Another CSV</span>
                </button>

                <ExportDropdown result={analysisResult} />
              </div>
            </div>

            {/* Section 1: KPI Cards */}
            <KpiCards stats={analysisResult.stats} />

            {/* Section 2: Executive Briefing */}
            <ExecutiveSummary result={analysisResult} />

            {/* Section 3: Sentiment Visualizations */}
            <SentimentCharts stats={analysisResult.stats} />

            {/* Section 4: Keyword Analytics & Word Cloud */}
            <KeywordAnalytics
              keywords={analysisResult.keywords}
              themes={analysisResult.themes}
              selectedKeyword={selectedKeyword}
              onSelectKeyword={setSelectedKeyword}
            />

            {/* Section 5: Positive & Negative Insights Cards */}
            <InsightsCards
              records={analysisResult.records}
              onSelectComment={(c) => setSelectedModalComment(c)}
            />

            {/* Section 6: Filterable Comments Table */}
            <CommentsTable
              records={analysisResult.records}
              selectedKeyword={selectedKeyword}
              onSelectKeyword={setSelectedKeyword}
              selectedModalComment={selectedModalComment}
              onSelectModalComment={setSelectedModalComment}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onConfigSaved={() => {
          if (analysisResult) {
            handleStartAnalysis(
              '',
              analysisResult.fileName,
              analysisResult.records.map((r) => ({ [analysisResult.selectedCommentColumn]: r.originalText })),
              analysisResult.selectedCommentColumn
            );
          }
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

