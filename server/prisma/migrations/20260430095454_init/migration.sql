-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "hod_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "duration_years" INTEGER NOT NULL DEFAULT 4,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "usn" VARCHAR(255),
    "employee_id" VARCHAR(255),
    "phone" VARCHAR(255),
    "department_id" TEXT NOT NULL,
    "profile_photo_url" VARCHAR(500),
    "status" TEXT NOT NULL DEFAULT 'active',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "id" TEXT NOT NULL,
    "role" VARCHAR(30) NOT NULL DEFAULT 'student',
    "user_id" TEXT NOT NULL,
    "granted_by" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicCycles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicCycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batches" (
    "id" TEXT NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "specialization_id" TEXT NOT NULL,

    CONSTRAINT "Batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sections" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "batch_id" TEXT NOT NULL,
    "academic_cycle_id" TEXT NOT NULL,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subjects" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "specialization_id" TEXT NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 3,
    "type" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "specialization_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "is_elective" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionSubject" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "academic_cycle_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SectionSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAcademicStatus" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "academic_cycle_id" TEXT NOT NULL,
    "current_year" INTEGER NOT NULL,
    "current_semester" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'promoted',
    "remarks" VARCHAR(500),
    "promoted_from_cycle_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAcademicStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollments" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "academic_cycle_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingAssignments" (
    "id" TEXT NOT NULL,
    "section_subject_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "specialization_id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL DEFAULT 'theory',
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "replace_by" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeachingAssignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoordinatorAssignments" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "specialization_id" TEXT NOT NULL,
    "academic_cycle_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "branchId" TEXT,

    CONSTRAINT "CoordinatorAssignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultySpecializationMap" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "specialization_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_primary_specs" BOOLEAN NOT NULL DEFAULT true,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacultySpecializationMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_department_id_key" ON "Branch"("name", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_code_key" ON "Specialization"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_name_branch_id_key" ON "Specialization"("name", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_usn_key" ON "User"("usn");

-- CreateIndex
CREATE UNIQUE INDEX "User_employee_id_key" ON "User"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_department_id_idx" ON "User"("department_id");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_status_department_id_idx" ON "User"("status", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicCycles_name_key" ON "AcademicCycles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Batches_label_key" ON "Batches"("label");

-- CreateIndex
CREATE INDEX "Batches_specialization_id_idx" ON "Batches"("specialization_id");

-- CreateIndex
CREATE UNIQUE INDEX "Batches_start_year_end_year_specialization_id_key" ON "Batches"("start_year", "end_year", "specialization_id");

-- CreateIndex
CREATE INDEX "Sections_batch_id_idx" ON "Sections"("batch_id");

-- CreateIndex
CREATE INDEX "Sections_academic_cycle_id_batch_id_idx" ON "Sections"("academic_cycle_id", "batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "Sections_batch_id_academic_cycle_id_name_key" ON "Sections"("batch_id", "academic_cycle_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_code_key" ON "Subjects"("code");

-- CreateIndex
CREATE INDEX "Subjects_specialization_id_idx" ON "Subjects"("specialization_id");

-- CreateIndex
CREATE INDEX "Subjects_specialization_id_year_idx" ON "Subjects"("specialization_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_name_specialization_id_key" ON "Subjects"("name", "specialization_id");

-- CreateIndex
CREATE INDEX "Curriculum_specialization_id_idx" ON "Curriculum"("specialization_id");

-- CreateIndex
CREATE INDEX "Curriculum_year_semester_idx" ON "Curriculum"("year", "semester");

-- CreateIndex
CREATE INDEX "Curriculum_specialization_id_year_semester_idx" ON "Curriculum"("specialization_id", "year", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_specialization_id_subject_id_year_semester_key" ON "Curriculum"("specialization_id", "subject_id", "year", "semester");

-- CreateIndex
CREATE INDEX "SectionSubject_section_id_academic_cycle_id_idx" ON "SectionSubject"("section_id", "academic_cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "SectionSubject_section_id_subject_id_academic_cycle_id_year_key" ON "SectionSubject"("section_id", "subject_id", "academic_cycle_id", "year", "semester");

-- CreateIndex
CREATE INDEX "StudentAcademicStatus_student_id_idx" ON "StudentAcademicStatus"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAcademicStatus_student_id_academic_cycle_id_key" ON "StudentAcademicStatus"("student_id", "academic_cycle_id");

-- CreateIndex
CREATE INDEX "Enrollments_section_id_academic_cycle_id_idx" ON "Enrollments"("section_id", "academic_cycle_id");

-- CreateIndex
CREATE INDEX "Enrollments_student_id_academic_cycle_id_idx" ON "Enrollments"("student_id", "academic_cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_student_id_academic_cycle_id_year_semester_key" ON "Enrollments"("student_id", "academic_cycle_id", "year", "semester");

-- CreateIndex
CREATE INDEX "TeachingAssignments_faculty_id_specialization_id_idx" ON "TeachingAssignments"("faculty_id", "specialization_id");

-- CreateIndex
CREATE INDEX "TeachingAssignments_section_subject_id_idx" ON "TeachingAssignments"("section_subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "TeachingAssignments_section_subject_id_faculty_id_type_key" ON "TeachingAssignments"("section_subject_id", "faculty_id", "type");

-- CreateIndex
CREATE INDEX "CoordinatorAssignments_faculty_id_idx" ON "CoordinatorAssignments"("faculty_id");

-- CreateIndex
CREATE INDEX "CoordinatorAssignments_department_id_idx" ON "CoordinatorAssignments"("department_id");

-- CreateIndex
CREATE INDEX "CoordinatorAssignments_specialization_id_idx" ON "CoordinatorAssignments"("specialization_id");

-- CreateIndex
CREATE INDEX "CoordinatorAssignments_academic_cycle_id_idx" ON "CoordinatorAssignments"("academic_cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "CoordinatorAssignments_faculty_id_department_id_specializat_key" ON "CoordinatorAssignments"("faculty_id", "department_id", "specialization_id", "academic_cycle_id", "year", "semester");

-- CreateIndex
CREATE INDEX "FacultySpecializationMap_faculty_id_idx" ON "FacultySpecializationMap"("faculty_id");

-- CreateIndex
CREATE INDEX "FacultySpecializationMap_specialization_id_idx" ON "FacultySpecializationMap"("specialization_id");

-- CreateIndex
CREATE UNIQUE INDEX "FacultySpecializationMap_faculty_id_specialization_id_key" ON "FacultySpecializationMap"("faculty_id", "specialization_id");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_hod_id_fkey" FOREIGN KEY ("hod_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialization" ADD CONSTRAINT "Specialization_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batches" ADD CONSTRAINT "Batches_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_academic_cycle_id_fkey" FOREIGN KEY ("academic_cycle_id") REFERENCES "AcademicCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionSubject" ADD CONSTRAINT "SectionSubject_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionSubject" ADD CONSTRAINT "SectionSubject_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionSubject" ADD CONSTRAINT "SectionSubject_academic_cycle_id_fkey" FOREIGN KEY ("academic_cycle_id") REFERENCES "AcademicCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAcademicStatus" ADD CONSTRAINT "StudentAcademicStatus_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAcademicStatus" ADD CONSTRAINT "StudentAcademicStatus_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAcademicStatus" ADD CONSTRAINT "StudentAcademicStatus_academic_cycle_id_fkey" FOREIGN KEY ("academic_cycle_id") REFERENCES "AcademicCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAcademicStatus" ADD CONSTRAINT "StudentAcademicStatus_promoted_from_cycle_id_fkey" FOREIGN KEY ("promoted_from_cycle_id") REFERENCES "AcademicCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_academic_cycle_id_fkey" FOREIGN KEY ("academic_cycle_id") REFERENCES "AcademicCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingAssignments" ADD CONSTRAINT "TeachingAssignments_section_subject_id_fkey" FOREIGN KEY ("section_subject_id") REFERENCES "SectionSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingAssignments" ADD CONSTRAINT "TeachingAssignments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingAssignments" ADD CONSTRAINT "TeachingAssignments_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingAssignments" ADD CONSTRAINT "TeachingAssignments_replace_by_fkey" FOREIGN KEY ("replace_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorAssignments" ADD CONSTRAINT "CoordinatorAssignments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorAssignments" ADD CONSTRAINT "CoordinatorAssignments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorAssignments" ADD CONSTRAINT "CoordinatorAssignments_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorAssignments" ADD CONSTRAINT "CoordinatorAssignments_academic_cycle_id_fkey" FOREIGN KEY ("academic_cycle_id") REFERENCES "AcademicCycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorAssignments" ADD CONSTRAINT "CoordinatorAssignments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultySpecializationMap" ADD CONSTRAINT "FacultySpecializationMap_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultySpecializationMap" ADD CONSTRAINT "FacultySpecializationMap_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
