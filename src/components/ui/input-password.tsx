'use client';

import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { Input } from '@/components/ui/input';

export type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
};

export default function PasswordInput({
  value,
  onChange,
  id: idProp,
}: PasswordInputProps) {
  const id = useId();
  const inputId = idProp || id;
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: '8 characters' },
      { regex: /[0-9]/, text: 'Number' },
      { regex: /[a-z]/, text: 'Lowercase letter' },
      { regex: /[A-Z]/, text: 'Uppercase letter' },
      { regex: /[^A-Za-z0-9]/, text: 'Special character' },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(value);

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="*:not-first:mt-2">
        <div className="relative">
          <Input
            aria-describedby={`${inputId}-description`}
            autoComplete="new-password"
            className="pe-9"
            id={inputId}
            onChange={onChange}
            placeholder="********"
            type={isVisible ? 'text' : 'password'}
            value={value}
          />
          <button
            aria-controls="password"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={toggleVisibility}
            tabIndex={-1}
            type="button"
          >
            {isVisible ? (
              <EyeOffIcon aria-hidden="true" size={16} />
            ) : (
              <EyeIcon aria-hidden="true" size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Password requirements list */}
      <div
        aria-live="polite"
        className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
      >
        {strength.map((req) => (
          <div className="flex items-center gap-1" key={req.text}>
            {req.met ? (
              <CheckIcon
                aria-hidden="true"
                className="text-emerald-500"
                size={16}
              />
            ) : (
              <XIcon
                aria-hidden="true"
                className="text-muted-foreground/80"
                size={16}
              />
            )}
            <span
              className={`text-xs ${
                req.met ? 'text-emerald-600' : 'text-muted-foreground'
              }`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? ' - Requirement met' : ' - Requirement not met'}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
