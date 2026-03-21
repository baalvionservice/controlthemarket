'use client';

import type { OnboardingData } from '../onboarding-flow';

interface Step4Props {
    data: OnboardingData;
}

export function Step4Review({ data }: Step4Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded-md border p-4">
        <h3 className="font-semibold">Company Details</h3>
        <p><span className="font-medium text-muted-foreground">Name:</span> {data.companyName}</p>
        <p><span className="font-medium text-muted-foreground">Website:</span> {data.companyWebsite}</p>
        <p><span className="font-medium text-muted-foreground">Description:</span> {data.companyDescription}</p>
      </div>
       <div className="space-y-2 rounded-md border p-4">
        <h3 className="font-semibold">Invited Team Members</h3>
        {data.invitedUsers.length > 0 ? (
             <ul className="list-disc pl-5 text-muted-foreground">
                {data.invitedUsers.map(email => <li key={email}>{email}</li>)}
            </ul>
        ) : (
            <p className="text-muted-foreground">No team members were invited.</p>
        )}
      </div>
       <div className="space-y-2 rounded-md border p-4">
        <h3 className="font-semibold">First Task</h3>
        <p><span className="font-medium text-muted-foreground">Title:</span> {data.taskTitle}</p>
        <p className="text-muted-foreground whitespace-pre-wrap"><span className="font-medium text-muted-foreground">Description:</span> {data.taskDescription}</p>
      </div>
    </div>
  );
}
