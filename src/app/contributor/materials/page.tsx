'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { isAdmin } from '@/lib/admin';
import { useLocale } from '@/context/locale-context';
import { StudyMaterialUploader } from '@/components/study-material-uploader';
import { getAllExams, getExamById } from '@/lib/exams';
import { ChevronRight, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface FileUpload {
  file: File;
  title: string;
  description: string;
  error?: string;
}

type Step = 'exam' | 'subject' | 'upload';

export default function ContributorMaterialsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { t } = useLocale();

  const [step, setStep] = useState<Step>('exam');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  const exams = getAllExams();
  const selectedExamObj = selectedExam ? getExamById(selectedExam) : null;
  const subjects = selectedExamObj?.subjects || [];

  // Check auth
  useEffect(() => {
    if (!userLoading && user && !isAdmin(user.role, user.email) && user.role !== 'contributor') {
      router.push('/');
    }
  }, [user, userLoading, router]);

  // Get exam name
  const examName = selectedExam
    ? exams.find((e) => e.id === selectedExam)?.name
    : null;

  // Get subject name
  const subjectName = selectedSubject
    ? subjects.find((s) => s.id === selectedSubject)?.name
    : null;

  const handleFilesSelected = (selectedFiles: FileUpload[]) => {
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!selectedExam || !selectedSubject || files.length === 0) {
      setUploadStatus('error');
      setUploadMessage('Please select exam, subject, and add files');
      return;
    }

    // Check for files with errors
    const errorFiles = files.filter((f) => f.error);
    if (errorFiles.length > 0) {
      setUploadStatus('error');
      setUploadMessage('Please remove files with errors before uploading');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('examId', selectedExam);
      formData.append('subjectId', selectedSubject);

      files.forEach((file, index) => {
        formData.append('files', file.file);
        formData.append(`titles[${index}]`, file.title);
        formData.append(`descriptions[${index}]`, file.description);
      });

      const response = await fetch('/api/contributor/study-materials', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadStatus('success');
      setUploadMessage(
        data.message || `${files.length} material(s) uploaded successfully for review!`
      );
      setFiles([]);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/contributor/submissions');
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(
        error instanceof Error ? error.message : 'Upload failed. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && user.role !== 'contributor')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-8 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Upload Study Materials
          </h1>
          <p className="text-lg text-slate-600">
            Share your study materials (PDF, DOCX, PPT) with the community
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-12">
          <div className={`flex items-center gap-2 ${step !== 'exam' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'exam' ? 'bg-indigo-600' : 'bg-slate-300'
            }`}>
              1
            </div>
            <span className="font-medium text-slate-700">Select Exam</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
          <div className={`flex items-center gap-2 ${step !== 'subject' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'subject' ? 'bg-indigo-600' : 'bg-slate-300'
            }`}>
              2
            </div>
            <span className="font-medium text-slate-700">Select Subject</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
          <div className={`flex items-center gap-2 ${step !== 'upload' ? 'opacity-60' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              step === 'upload' ? 'bg-indigo-600' : 'bg-slate-300'
            }`}>
              3
            </div>
            <span className="font-medium text-slate-700">Upload Files</span>
          </div>
        </div>

        {/* Step 1: Select Exam */}
        {step === 'exam' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setSelectedSubject(null);
                    setStep('subject');
                  }}
                  className="p-6 text-left border-2 border-slate-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-slate-900">{exam.name}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Share materials for {exam.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Subject */}
        {step === 'subject' && examName && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-4 bg-indigo-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <p className="text-slate-700">Selected: <span className="font-semibold">{examName}</span></p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900">Select Subject</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject.id);
                    setStep('upload');
                  }}
                  className="p-6 text-left border-2 border-slate-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-slate-900">{subject.name}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedExam(null);
                setStep('exam');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Change Exam
            </button>
          </div>
        )}

        {/* Step 3: Upload Files */}
        {step === 'upload' && examName && subjectName && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div>
                <p className="text-slate-700">
                  <span className="font-semibold">{examName}</span> • <span className="font-semibold">{subjectName}</span>
                </p>
              </div>
            </div>

            {/* Status Messages */}
            {uploadStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Upload successful!</p>
                  <p className="text-sm text-green-800 mt-1">{uploadMessage}</p>
                </div>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Upload failed</p>
                  <p className="text-sm text-red-800 mt-1">{uploadMessage}</p>
                </div>
              </div>
            )}

            {/* File Uploader */}
            <StudyMaterialUploader
              onFilesSelected={handleFilesSelected}
              isLoading={isUploading}
              maxFiles={10}
              maxFileSize={50}
              maxBatchSize={200}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0 || files.some((f) => f.error)}
                className="flex-1 px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Materials
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setStep('subject');
                  setSelectedSubject(null);
                }}
                disabled={isUploading}
                className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-slate-400 disabled:opacity-50 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
