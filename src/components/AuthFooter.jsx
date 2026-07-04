import React from 'react';

export default function AuthFooter() {
    const currentYear = new Date().getFullYear();
    return (
        <div className="mt-8 text-center text-xs text-gray-500 space-y-2">
            <div className="flex justify-center gap-4">
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <span>&bull;</span>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>&bull;</span>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
            </div>
            <div>
                &copy; {currentYear} DecisionOS Technologies Inc.
            </div>
        </div>
    );
}
