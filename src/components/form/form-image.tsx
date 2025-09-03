'use client';

import { ImageIcon, Loader2, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { validateFile } from '@/lib/s3/s3-types';

type Props<S> = {
  title: string;
  schema: keyof S & string;
  imagePreviewSchema?: keyof S & string;
  deleteImageSchema?: keyof S & string;
  maxSize?: number;
  allowedTypes?: string[];
  className?: string;
  aspectRatio?: string;
  previewUrl?: string | null;
  onImageChange?: (file: File | undefined) => void;
};

export function FormImage<S>({
  title,
  schema,
  imagePreviewSchema,
  deleteImageSchema = 'deleteImage' as keyof S & string,
  maxSize = 5 * 1024 * 1024, // Default to 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className,
  aspectRatio = 'aspect-[4/5]',
  previewUrl,
  onImageChange,
}: Props<S>) {
  const form = useFormContext();
  const [imagePreview, setImagePreview] = useState<string | null>(
    previewUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (previewUrl) {
      setImagePreview(previewUrl);
    }
  }, [previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Validate file before proceeding
      validateFile(file, {
        maxSize,
        allowedTypes,
      }); // Store the file in the form
      // @ts-expect-error - Need to use any to set file value
      form.setValue(schema, file);
      if (imagePreviewSchema) {
        // @ts-expect-error - Need to use any to set file value
        form.setValue(imagePreviewSchema, file);
      }
      if (deleteImageSchema) {
        // @ts-expect-error - Need to use any to set boolean value
        form.setValue(deleteImageSchema, false);
      }

      // Create an image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setIsUploading(false);

        if (onImageChange) {
          onImageChange(file);
        }

        toast('Image has been selected and is ready to upload');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast.error(
        error instanceof Error ? error.message : 'Failed to process image'
      );
    }
  };

  return (
    <FormField
      control={form.control}
      name={schema}
      render={() => (
        <FormItem>
          <FormLabel>{title}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* Image Upload Area with Preview */}
              <div className="space-y-3">
                <button
                  className={`relative flex bg-muted/20 ${aspectRatio} w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed p-2 ${className}`}
                  onClick={() =>
                    document.getElementById(`${schema}-image-input`)?.click()
                  }
                  type="button"
                >
                  {/* Upload icon or preview image */}
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        Uploading...
                      </p>
                    </div>
                  ) : null}

                  {/* Render image preview or upload prompt */}
                  {!isUploading &&
                    (imagePreview ? (
                      <>
                        <div className="relative flex h-full w-full items-center justify-center">
                          <Image
                            alt={`${title} preview`}
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            src={imagePreview}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                          <div className="rounded-full bg-white p-3">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                          <span className="mt-2 font-medium text-sm text-white">
                            Click to change
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-3">
                          <ImageIcon className="h-8 w-8 text-primary" />
                        </div>
                        <p className="font-medium text-muted-foreground text-sm">
                          Click to add {title.toLowerCase()}
                        </p>
                        <p className="text-muted-foreground/70 text-xs">
                          4:5 ratio recommended
                        </p>
                        <p className="text-muted-foreground/70 text-xs">
                          PNG, JPG or WebP (max. 5MB)
                        </p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            document
                              .getElementById(`${schema}-image-input`)
                              ?.click();
                          }}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Browse Files
                        </Button>
                      </div>
                    ))}

                  {/* Hidden file input */}
                  <input
                    accept={allowedTypes.join(',')}
                    className="sr-only"
                    id={`${schema}-image-input`}
                    onChange={handleImageChange}
                    type="file"
                  />
                </button>

                {/* Image controls */}
                {imagePreview && (
                  <div className="flex justify-between gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        // Confirm image removal
                        const confirmed = window.confirm(
                          'Are you sure you want to remove this image?'
                        );
                        if (!confirmed) return;
                        setImagePreview(null);
                        // @ts-expect-error - Need to use any to set undefined value
                        form.setValue(schema, undefined);
                        if (deleteImageSchema) {
                          // @ts-expect-error - Need to use any to set boolean value
                          form.setValue(deleteImageSchema, true);
                        }
                        if (imagePreviewSchema) {
                          // @ts-expect-error - Need to use any to set undefined value
                          form.setValue(imagePreviewSchema, undefined);
                        }

                        if (onImageChange) {
                          onImageChange(undefined);
                        }

                        toast('Image will be removed when you save');
                      }}
                      size="sm"
                      type="button"
                      variant="destructive"
                    >
                      <Trash2Icon className="mr-1 h-4 w-4" />
                      Remove Image
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() =>
                        document
                          .getElementById(`${schema}-image-input`)
                          ?.click()
                      }
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <ImageIcon className="mr-1 h-4 w-4" />
                      Change Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
