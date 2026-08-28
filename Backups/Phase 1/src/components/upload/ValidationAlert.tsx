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
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
          <div className="flex items-start space-x-2.5">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-bold text-rose-900 mb-1">CSV Validation Failed</h5>
              <ul className="list-disc list-inside space-y-1 text-rose-800">
                {validation.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
              <div className="mt-2.5 pt-2 border-t border-rose-200 text-rose-700 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Tip: Ensure your file is a valid .csv file with a header row containing comment text.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-bold text-amber-900 mb-1">Notice & Adjustments</h5>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
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
