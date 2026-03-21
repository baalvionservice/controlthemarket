'use client';

import { useState } from 'react';
import { OnboardingStepper } from './onboarding-stepper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Step1CompanyDetails } from './steps/step-1-company-details';
import { Step2InviteUsers } from './steps/step-2-invite-users';
import { Step3CreateTask } from './steps/step-3-create-task';
import { Step4Review } from './steps/step-4-review';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const steps = ['Company Details', 'Invite Team', 'Create First Task', 'Review & Finish'];

export type OnboardingData = {
    companyName: string;
    companyWebsite: string;
    companyDescription: string;
    invitedUsers: string[];
    taskTitle: string;
    taskDescription: string;
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    invitedUsers: [],
    taskTitle: '',
    taskDescription: '',
  });
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const handleNext = (stepData: Partial<OnboardingData>) => {
    const newData = { ...data, ...stepData };
    setData(newData);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step
      console.log('Onboarding complete:', newData);
      // Here you would typically save all data to your backend
      updateUser({ onboardingCompleted: true });
      router.push('/company/dashboard');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const renderStep = () => {
      switch (currentStep) {
          case 0: return <Step1CompanyDetails onNext={handleNext} data={data} />;
          case 1: return <Step2InviteUsers onNext={handleNext} data={data} />;
          case 2: return <Step3CreateTask onNext={handleNext} data={data} />;
          case 3: return <Step4Review data={data} />;
          default: return null;
      }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
        <OnboardingStepper steps={steps} currentStep={currentStep} />
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">{steps[currentStep]}</CardTitle>
                <CardDescription>
                    {
                        currentStep === 0 ? "Let's start with the basics. Tell us about your company." :
                        currentStep === 1 ? "Invite your team members to collaborate." :
                        currentStep === 2 ? "Let's create your first task to attract candidates." :
                        "Please review the information below before completing your setup."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderStep()}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0}>
                    Previous
                </Button>
                 {currentStep !== 3 && ( // The submit logic is inside the step components
                    <Button type="submit" form={`step-${currentStep}-form`}>
                        Next
                    </Button>
                )}
                 {currentStep === 3 && (
                    <Button onClick={() => handleNext({})}>
                        Finish Setup
                    </Button>
                )}
            </CardFooter>
        </Card>
    </div>
  );
}
