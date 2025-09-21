import React from 'react';
import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'card' | 'table';
    onViewModeChange: (mode: 'card' | 'table') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
    viewMode,
    onViewModeChange
}) => {
    return (
        <div className="flex items-center bg-warm-brown-100 rounded-lg py-1 px-2">
            <button
                onClick={() => onViewModeChange('card')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${viewMode === 'card'
                    ? 'bg-white text-sage-green-600 shadow-sm'
                    : 'text-warm-brown-600 hover:text-warm-brown-800'
                    }`}
                type="button"
            >
                <Grid size={16} />
                <span className="text-sm">Card View</span>
            </button>
            <button
                onClick={() => onViewModeChange('table')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${viewMode === 'table'
                    ? 'bg-white text-sage-green-600 shadow-sm'
                    : 'text-warm-brown-600 hover:text-warm-brown-800'
                    }`}
                type="button"
            >
                <List size={16} />
                <span className="text-sm">Table View</span>
            </button>
        </div>
    );
};

export default ViewToggle;