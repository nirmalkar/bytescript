'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSaveResumeMutation } from '@/store/slices/resumeSlice';
import { Resume } from '@/types/resume';

export default function NewResumePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [resume, setResume] = useState<Partial<Resume>>({
    title: 'My Professional Resume',
    template: 'modern',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
    certifications: [],
  });

  const [saveResume, { isLoading: isSaving, error: saveError }] =
    useSaveResumeMutation();

  const handleSave = async () => {
    try {
      const result = await saveResume(resume);
      if (result.data) {
        router.push(`/resume/edit/${result.data.id}`);
      }
    } catch (error) {
      console.error('Failed to save resume:', error);
    }
  };

  const updatePersonalInfo = (
    field: keyof Resume['personalInfo'],
    value: string
  ) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        fullName: prev.personalInfo?.fullName || '',
        email: prev.personalInfo?.email || '',
        phone: prev.personalInfo?.phone || '',
        location: prev.personalInfo?.location || '',
        summary: prev.personalInfo?.summary || '',
        website: prev.personalInfo?.website,
        linkedin: prev.personalInfo?.linkedin,
        github: prev.personalInfo?.github,
        [field]: value,
      },
    }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: '',
        },
      ],
    }));
  };

  const updateEducation = (
    id: string,
    field: keyof Resume['education'][0],
    value: any
  ) => {
    setResume((prev) => ({
      ...prev,
      education: (prev.education || []).map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: (prev.education || []).filter((edu) => edu.id !== id),
    }));
  };

  const addWorkExperience = () => {
    setResume((prev) => ({
      ...prev,
      workExperience: [
        ...(prev.workExperience || []),
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: [],
        },
      ],
    }));
  };

  const updateWorkExperience = (
    id: string,
    field: keyof Resume['workExperience'][0],
    value: any
  ) => {
    setResume((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).map((work) =>
        work.id === id ? { ...work, [field]: value } : work
      ),
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).filter(
        (work) => work.id !== id
      ),
    }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          id: Date.now().toString(),
          name: '',
          description: '',
          technologies: [],
          startDate: '',
          endDate: '',
          url: '',
          highlights: [],
        },
      ],
    }));
  };

  const updateProject = (
    id: string,
    field: keyof Resume['projects'][0],
    value: any
  ) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((project) => project.id !== id),
    }));
  };

  const addSkill = () => {
    setResume((prev) => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        {
          id: Date.now().toString(),
          name: '',
          level: 'Intermediate' as const,
          category: '',
        },
      ],
    }));
  };

  const updateSkill = (
    id: string,
    field: keyof Resume['skills'][0],
    value: any
  ) => {
    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((skill) => skill.id !== id),
    }));
  };

  const _addCertification = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        {
          id: Date.now().toString(),
          name: '',
          issuer: '',
          date: '',
          url: '',
        },
      ],
    }));
  };

  const _updateCertification = (
    id: string,
    field: keyof Resume['certifications'][0],
    value: any
  ) => {
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const _removeCertification = (id: string) => {
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter(
        (cert) => cert.id !== id
      ),
    }));
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7 7"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5H5a2 2 0 002 2v10a2 2 0 002 2h10"
            />
          </svg>
          Back to Resumes
        </Button>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Create New Resume</h1>
        <p className="text-gray-600 mb-6">
          Build your professional resume step by step. Fill in your information
          and choose a template that suits your style.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={resume.personalInfo?.fullName || ''}
                    onChange={(e) =>
                      updatePersonalInfo('fullName', e.target.value)
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resume.personalInfo?.email || ''}
                    onChange={(e) =>
                      updatePersonalInfo('email', e.target.value)
                    }
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resume.personalInfo?.phone || ''}
                    onChange={(e) =>
                      updatePersonalInfo('phone', e.target.value)
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resume.personalInfo?.location || ''}
                    onChange={(e) =>
                      updatePersonalInfo('location', e.target.value)
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={resume.personalInfo?.website || ''}
                    onChange={(e) =>
                      updatePersonalInfo('website', e.target.value)
                    }
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={resume.personalInfo?.linkedin || ''}
                    onChange={(e) =>
                      updatePersonalInfo('linkedin', e.target.value)
                    }
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={resume.personalInfo?.github || ''}
                    onChange={(e) =>
                      updatePersonalInfo('github', e.target.value)
                    }
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={resume.personalInfo?.summary || ''}
                  onChange={(e) =>
                    updatePersonalInfo('summary', e.target.value)
                  }
                  placeholder="Experienced software developer with expertise in..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Education</CardTitle>
              <Button onClick={addEducation} size="sm">
                Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.education?.map((edu) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Education Entry</h4>
                    <Button
                      onClick={() => removeEducation(edu.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`institution-${edu.id}`}>
                        Institution
                      </Label>
                      <Input
                        id={`institution-${edu.id}`}
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, 'institution', e.target.value)
                        }
                        placeholder="University of California, Berkeley"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                      <Input
                        id={`degree-${edu.id}`}
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, 'degree', e.target.value)
                        }
                        placeholder="Bachelor of Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                      <Input
                        id={`field-${edu.id}`}
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(edu.id, 'field', e.target.value)
                        }
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`gpa-${edu.id}`}>GPA (Optional)</Label>
                      <Input
                        id={`gpa-${edu.id}`}
                        value={edu.gpa || ''}
                        onChange={(e) =>
                          updateEducation(edu.id, 'gpa', e.target.value)
                        }
                        placeholder="3.8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                      <Input
                        id={`startDate-${edu.id}`}
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(edu.id, 'startDate', e.target.value)
                        }
                        placeholder="2020-09"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${edu.id}`}
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, 'endDate', e.target.value)
                        }
                        placeholder="2024-05"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`description-${edu.id}`}>Description</Label>
                    <Textarea
                      id={`description-${edu.id}`}
                      value={edu.description || ''}
                      onChange={(e) =>
                        updateEducation(edu.id, 'description', e.target.value)
                      }
                      placeholder="Activities, achievements, etc."
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              {(!resume.education || resume.education.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No education added yet. Click &quot;Add Education&quot; to get
                  started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Experience */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Work Experience</CardTitle>
              <Button onClick={addWorkExperience} size="sm">
                Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.workExperience?.map((work) => (
                <div key={work.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Work Experience Entry</h4>
                    <Button
                      onClick={() => removeWorkExperience(work.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`company-${work.id}`}>Company</Label>
                      <Input
                        id={`company-${work.id}`}
                        value={work.company}
                        onChange={(e) =>
                          updateWorkExperience(
                            work.id,
                            'company',
                            e.target.value
                          )
                        }
                        placeholder="Tech Corp"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`position-${work.id}`}>Position</Label>
                      <Input
                        id={`position-${work.id}`}
                        value={work.position}
                        onChange={(e) =>
                          updateWorkExperience(
                            work.id,
                            'position',
                            e.target.value
                          )
                        }
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`location-${work.id}`}>Location</Label>
                      <Input
                        id={`location-${work.id}`}
                        value={work.location}
                        onChange={(e) =>
                          updateWorkExperience(
                            work.id,
                            'location',
                            e.target.value
                          )
                        }
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`current-${work.id}`}>
                        Current Position
                      </Label>
                      <Select
                        value={work.current ? 'true' : 'false'}
                        onValueChange={(value) =>
                          updateWorkExperience(
                            work.id,
                            'current',
                            value === 'true'
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Current Position</SelectItem>
                          <SelectItem value="false">
                            Previous Position
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`startDate-${work.id}`}>Start Date</Label>
                      <Input
                        id={`startDate-${work.id}`}
                        value={work.startDate}
                        onChange={(e) =>
                          updateWorkExperience(
                            work.id,
                            'startDate',
                            e.target.value
                          )
                        }
                        placeholder="2021-06"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${work.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${work.id}`}
                        value={work.endDate}
                        onChange={(e) =>
                          updateWorkExperience(
                            work.id,
                            'endDate',
                            e.target.value
                          )
                        }
                        placeholder="2022-05"
                        disabled={work.current}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`description-${work.id}`}>
                      Job Description
                    </Label>
                    <Textarea
                      id={`description-${work.id}`}
                      value={work.description}
                      onChange={(e) =>
                        updateWorkExperience(
                          work.id,
                          'description',
                          e.target.value
                        )
                      }
                      placeholder="Describe your role and responsibilities..."
                      rows={4}
                    />
                  </div>
                </div>
              ))}

              {(!resume.workExperience ||
                resume.workExperience.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No work experience added yet. Click &quot;Add Experience&quot;
                  to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Projects</CardTitle>
              <Button onClick={addProject} size="sm">
                Add Project
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.projects?.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Project Entry</h4>
                    <Button
                      onClick={() => removeProject(project.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`projectName-${project.id}`}>
                        Project Name
                      </Label>
                      <Input
                        id={`projectName-${project.id}`}
                        value={project.name}
                        onChange={(e) =>
                          updateProject(project.id, 'name', e.target.value)
                        }
                        placeholder="E-Commerce Platform"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`url-${project.id}`}>Project URL</Label>
                      <Input
                        id={`url-${project.id}`}
                        value={project.url || ''}
                        onChange={(e) =>
                          updateProject(project.id, 'url', e.target.value)
                        }
                        placeholder="https://project-demo.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`projectDesc-${project.id}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`projectDesc-${project.id}`}
                      value={project.description}
                      onChange={(e) =>
                        updateProject(project.id, 'description', e.target.value)
                      }
                      placeholder="Describe your project..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`technologies-${project.id}`}>
                      Technologies (comma-separated)
                    </Label>
                    <Input
                      id={`technologies-${project.id}`}
                      value={project.technologies.join(', ')}
                      onChange={(e) =>
                        updateProject(
                          project.id,
                          'technologies',
                          e.target.value.split(',').map((t) => t.trim())
                        )
                      }
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`projectStart-${project.id}`}>
                        Start Date
                      </Label>
                      <Input
                        id={`projectStart-${project.id}`}
                        value={project.startDate}
                        onChange={(e) =>
                          updateProject(project.id, 'startDate', e.target.value)
                        }
                        placeholder="2023-01"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`projectEnd-${project.id}`}>
                        End Date (Optional)
                      </Label>
                      <Input
                        id={`projectEnd-${project.id}`}
                        value={project.endDate || ''}
                        onChange={(e) =>
                          updateProject(project.id, 'endDate', e.target.value)
                        }
                        placeholder="2023-06"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!resume.projects || resume.projects.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No projects added yet. Click &quot;Add Project&quot; to get
                  started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Skills</CardTitle>
              <Button onClick={addSkill} size="sm">
                Add Skill
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.skills?.map((skill) => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Skill Entry</h4>
                    <Button
                      onClick={() => removeSkill(skill.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`skillName-${skill.id}`}>
                        Skill Name
                      </Label>
                      <Input
                        id={`skillName-${skill.id}`}
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(skill.id, 'name', e.target.value)
                        }
                        placeholder="JavaScript"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`category-${skill.id}`}>Category</Label>
                      <Input
                        id={`category-${skill.id}`}
                        value={skill.category}
                        onChange={(e) =>
                          updateSkill(skill.id, 'category', e.target.value)
                        }
                        placeholder="Programming Languages"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`level-${skill.id}`}>Skill Level</Label>
                      <Select
                        value={skill.level}
                        onValueChange={(value) =>
                          updateSkill(
                            skill.id,
                            'level',
                            value as Resume['skills'][0]['level']
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              {(!resume.skills || resume.skills.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No skills added yet. Click &quot;Add Skill&quot; to get
                  started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="px-8"
          aria-describedby={saveError != null ? 'save-error' : undefined}
        >
          {isSaving ? 'Saving...' : 'Save Resume'}
        </Button>
      </div>

      {saveError !== null && (
        <div className="text-center mt-4">
          <p id="save-error" className="text-red-600" role="alert">
            Error saving resume:{' '}
            {saveError instanceof Error
              ? saveError.message
              : 'An unknown error occurred'}
          </p>
        </div>
      )}
    </div>
  );
}
