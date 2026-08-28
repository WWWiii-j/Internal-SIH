import React from 'react';
import { AlertTriangle, XCircle, Info, HelpCircle } from 'lucide-react';
import { CsvValidationResult } from '../../types';

interface ValidationAlertProps {
  validation: CsvValidationResult;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({ validation }) => {
  if (validation.errors.length === 0 && validation.warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6 animate-fade-in">
      {/* Critical Errors */}
      {validation.errors.length > 0 && (
        <div className="p-4 rounded-xl bg-terracotta-50/90 border border-terracotta-200 text-terracotta-900 text-xs">
          <div className="flex items-start space-x-2.5">
            <XCircle className="w-4 h-4 text-terracotta-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-bold text-terracotta-950 mb-1 text-xs">CSV Validation Notice</h5>
              <ul className="list-disc list-inside space-y-1 text-terracotta-800">
                {validation.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
              <div className="mt-2.5 pt-2 border-t border-terracotta-200 text-terracotta-800 flex items-center space-x-1.5 text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Tip: Ensure your file is a valid .csv format with column headers matching comment or feedback text.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 text-earth-800 text-xs">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-terracotta-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-bold text-earth-900 mb-1 text-xs">Preprocessing Notice</h5>
              <ul className="list-disc list-inside space-y-1 text-earth-700">
                {validation.warnings.map((warn, idx) => (
                  <li key={idx}>{warn}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


