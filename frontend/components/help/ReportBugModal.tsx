'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ReportBugModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportBugModal({
  open,
  onClose,
}: ReportBugModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Please enter a bug title.');
      return;
    }

    if (!category) {
      alert('Please select a category.');
      return;
    }

    if (!description.trim()) {
      alert('Please describe the issue.');
      return;
    }

    alert('Bug report submitted successfully.');

    // Reset form
    setTitle('');
    setCategory('');
    setDescription('');
    setEmail('');

    // Close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">

      <div className="w-full max-w-xl rounded-2xl border border-[#EADBC8] bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#EADBC8] px-6 py-5">

          <h2 className="text-2xl font-semibold text-[#C67A20]">
            Report a Bug
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[65vh] overflow-y-auto space-y-5 p-6">

          {/* Bug Title */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Bug Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bug title"
              className="w-full rounded-xl border border-[#EADBC8] px-4 py-3 outline-none transition focus:border-[#C67A20]"
            />

          </div>

          {/* Category */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[#EADBC8] px-4 py-3 outline-none transition focus:border-[#C67A20]"
            >
              <option value="">Select Category</option>
              <option value="UI Issue">UI Issue</option>
              <option value="Performance">Performance</option>
              <option value="Authentication">Authentication</option>
              <option value="Calendar">Calendar</option>
              <option value="Tasks">Tasks</option>
              <option value="Messages">Messages</option>
              <option value="Documents">Documents</option>
              <option value="Other">Other</option>
            </select>

          </div>

          {/* Description */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Describe the Issue
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened..."
              className="w-full rounded-xl border border-[#EADBC8] px-4 py-3 outline-none transition focus:border-[#C67A20]"
            />

          </div>

          {/* Email */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email (Optional)
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-[#EADBC8] px-4 py-3 outline-none transition focus:border-[#C67A20]"
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-[#EADBC8] px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-full border border-[#EADBC8] px-6 py-2.5 font-medium transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-full bg-[#C67A20] px-6 py-2.5 font-medium text-white transition hover:bg-[#B56F1A]"
          >
            Submit Report
          </button>

        </div>

      </div>

    </div>
  );
}