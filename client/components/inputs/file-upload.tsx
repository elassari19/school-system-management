'use client';

import React from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type Endpoint = 'imageUploader' | 'videoUploader';

interface Props {
  endpoint: Endpoint;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  className?: string;
  previewType?: 'image' | 'video';
}

const FileUpload = ({
  endpoint,
  value,
  onChange,
  accept,
  label,
  className,
  previewType = 'image',
}: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [pending, setPending] = React.useState(false);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url;
      if (url) onChange(url);
      setPending(false);
      setProgress(0);
      toast.success('Uploaded successfully');
    },
    onUploadError: (err) => {
      setPending(false);
      setProgress(0);
      toast.error(err?.message || 'Upload failed');
    },
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPending(true);
    await startUpload(Array.from(files));
  };

  const busy = isUploading || pending;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <span className="block text-start font-semibold">{label}:</span>}

      {value ? (
        <div className="relative rounded-md border overflow-hidden">
          {previewType === 'video' ? (
            <video src={value} controls className="w-full max-h-64 bg-black" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="upload preview" className="w-full max-h-64 object-cover" />
          )}
          <div className="flex items-center justify-between gap-2 p-2 bg-muted/40">
            <span className="text-xs break-all text-muted-foreground">{value}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              disabled={busy}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary bg-white p-6 text-sm text-muted-foreground transition hover:bg-muted/40',
            busy && 'opacity-70'
          )}
        >
          {busy ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{progress}%</span>
              <Progress value={progress} className="w-40" />
            </>
          ) : (
            <>
              <UploadCloud className="h-6 w-6" />
              <span>Click to upload</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default FileUpload;