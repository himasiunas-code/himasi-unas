-- CreateIndex
CREATE INDEX "activities_isPublished_createdAt_idx" ON "activities"("isPublished", "createdAt");

-- CreateIndex
CREATE INDEX "registrations_activityId_academicStatus_idx" ON "registrations"("activityId", "academicStatus");

-- CreateIndex
CREATE INDEX "registrations_academicStatus_idx" ON "registrations"("academicStatus");
