import { useSearchParams } from 'react-router-dom';
import { EmployerRegistrationForm } from './EmployerRegistrationForm';
import { SelfEmployedRegistrationForm } from './SelfEmployedRegistrationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

export function SignupForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const [registrationType, setRegistrationType] = useState<'employer' | 'self-employed'>(
    typeParam === 'self-employed' ? 'self-employed' : 'employer'
  );

  useEffect(() => {
    if (typeParam === 'employer' || typeParam === 'self-employed') {
      setRegistrationType(typeParam);
    }
  }, [typeParam]);

  const handleTypeChange = (value: string) => {
    const newType = value as 'employer' | 'self-employed';
    setRegistrationType(newType);
    setSearchParams({ type: newType });
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg border-0">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-xl font-bold text-primary">
          Register your Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Registration Type Toggle */}
        <div className="flex justify-start mb-6">
          <RadioGroup
            value={registrationType}
            onValueChange={handleTypeChange}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="employer" id="employer" />
              <Label htmlFor="employer" className="cursor-pointer font-medium">
                Employer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self-employed" id="self-employed" />
              <Label htmlFor="self-employed" className="cursor-pointer font-medium">
                Self Employed
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Render appropriate form */}
        {registrationType === 'employer' ? (
          <EmployerRegistrationForm />
        ) : (
          <SelfEmployedRegistrationForm />
        )}
      </CardContent>
    </Card>
  );
}
