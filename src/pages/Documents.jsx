import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    UploadCloud,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Database,
    Search,
    Check
} from 'lucide-react';

export default function Documents() {
    const [dragActive, setDragActive] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [files, setFiles] = useState([
        { name: 'Seed_Deck_v4.pdf', size: '4.2 MB', date: 'Yesterday', category: 'Investor Relations', status: 'Indexed' },
        { name: 'Q2_Financial_Consolidated.xlsx', size: '1.8 MB', date: '3 days ago', category: 'Finance Metrics', status: 'Indexed' },
        { name: 'Cap_Table_Simulation.pdf', size: '890 KB', date: '1 week ago', category: 'Hiring & Shares', status: 'Indexed' },
        { name: 'Bylaws_Approved_Delaware.pdf', size: '12.4 MB', date: '2 weeks ago', category: 'Legal Framework', status: 'Indexed' },
    ]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFile = {
                name: e.dataTransfer.files[0].name,
                size: `${Math.round(e.dataTransfer.files[0].size / 1024)} KB`,
                date: 'Today',
                category: 'Workspace General',
                status: 'Parsing'
            };

            setFiles([newFile, ...files]);
            setToastMessage(`File "${newFile.name}" dropped successfully. RAG ingestion scheduled.`);
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const deleteFile = (index) => {
        const updated = files.filter((_, idx) => idx !== index);
        setFiles(updated);
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8"
        >
            {/* Toast Alert */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 font-medium text-sm shadow-xl backdrop-blur-md"
                    >
                        <CheckCircle2 className="h-4.5 w-4.5" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className="text-left space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white">Documents Ingestion</h1>
                <p className="text-sm text-gray-400 font-normal">Upload corporate files to parse and feed automatically into your specialist AI context.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* main drop zone and files table */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Uploader drag active state */}
                    <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border border-dashed rounded-2xl p-8 text-center transition-all ${dragActive
                                ? 'bg-violet-600/10 border-violet-500 scale-[1.01]'
                                : 'bg-white/[0.01] border-white/10 hover:bg-white/[0.02] hover:border-white/20'
                            }`}
                    >
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                                <UploadCloud className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-white">Drag and drop file here, or click to browse</p>
                                <p className="text-xs text-gray-500 font-normal">Supports PDF, XLSX, DOCX, CSV. Maximum file size 25MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Files List Panel */}
                    <div className="space-y-4">

                        {/* Search Input bar */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search ingested files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-xs placeholder:text-gray-500 focus:border-violet-500 focus:bg-white/[0.04] transition-all text-left"
                            />
                        </div>

                        {/* Ingested Documents List */}
                        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-xl text-left bg-gradient-to-tr from-neutral-950/80 to-violet-950/[0.02]">
                            <div className="px-6 py-4.5 border-b border-white/5">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ingested Document Repository</h4>
                            </div>

                            {filteredFiles.length === 0 ? (
                                <div className="p-8 text-center text-sm text-gray-500">
                                    No files match query filter options.
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {filteredFiles.map((file, idx) => (
                                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                                            <div className="flex items-center gap-3.5">
                                                <div className="h-9 w-9 rounded-xl bg-violet-600/5 border border-violet-500/15 flex items-center justify-center text-violet-400">
                                                    <FileText className="h-4.5 w-4.5" />
                                                </div>
                                                <div className="space-y-0.5 text-left">
                                                    <h4 className="text-xs font-bold text-white tracking-wide">{file.name}</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                                        <span>{file.size}</span>
                                                        <span>•</span>
                                                        <span>{file.category}</span>
                                                        <span>•</span>
                                                        <span>Uploaded {file.date}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] tracking-wide uppercase ${file.status === 'Indexed'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:animate-pulse'
                                                    }`}>
                                                    {file.status}
                                                </span>

                                                <button
                                                    onClick={() => deleteFile(idx)}
                                                    className="p-1.5 rounded-md hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 transition-colors"
                                                    title="Purge file from AI context"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* right sidebar vector specs */}
                <div className="space-y-6">
                    <div className="glass-panel p-5.5 rounded-2xl border border-white/5 shadow-xl text-left space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Database className="h-4 w-4 text-violet-400" />
                            Retriever Vector Database
                        </h4>
                        <div className="space-y-3 text-xs leading-relaxed text-gray-400 font-normal">
                            <p>
                                DecisionOS converts files into sentence chunks and indexes them inside local context buckets.
                            </p>
                            <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/5 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-white font-semibold">
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    RAG Compliance Active
                                </div>
                                <p className="text-[10px]">
                                    Files are vector encrypted and locally containerized on the host workspace system. No data is stored externally.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </motion.div>
    );
}
