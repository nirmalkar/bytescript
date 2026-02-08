'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGetResumeQuery } from '@/store/slices/resumeSlice';

export default function ResumePreviewPage() {
  const params = useParams();
  const [isClient, setIsClient] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [isEditing, setIsEditing] = useState(false);
  const [editableResume, setEditableResume] = useState<any>(null);

  // Add print-specific styles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          /* Hide all browser UI elements during print */
          header, footer, nav, aside {
            display: none !important;
          }
          
          /* Hide any elements with these classes */
          .print\\:hidden {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: resume,
    isLoading,
    error,
  } = useGetResumeQuery(params.id as string, {
    skip: !params.id || !isClient,
  });

  // Sync editable resume when resume data changes
  useEffect(() => {
    if (resume && !editableResume) {
      setEditableResume(JSON.parse(JSON.stringify(resume)));
    }
  }, [resume, editableResume]);

  const handleDownloadPDF = async () => {
    try {
      // Import html2canvas and jsPDF dynamically
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      // Get the resume element
      const element = document.getElementById('resume-content');
      if (!element) {
        alert('Resume content not found');
        return;
      }

      // Create canvas from the resume element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Get image data
      const imgData = canvas.toDataURL('image/png');

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit A4 page
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download the PDF
      pdf.save(
        `${editableResume?.personalInfo?.fullName || resume?.personalInfo?.fullName || 'resume'}-resume.pdf`
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadDOCX = () => {
    alert('DOCX download would be implemented here');
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleFieldChange = (field: string, value: string | string[]) => {
    if (!editableResume) return;

    // Create a deep copy of editableResume to update
    const updatedResume = JSON.parse(JSON.stringify(editableResume));

    // Handle nested field updates
    if (field.includes('[')) {
      const [section, index, subField] = field.split(/[.[\]]/).filter(Boolean);
      if (updatedResume[section] && updatedResume[section][index]) {
        updatedResume[section][index][subField] = value;
      }
    } else if (
      field.startsWith('personalInfo.') ||
      field === 'fullName' ||
      field === 'email' ||
      field === 'phone' ||
      field === 'location' ||
      field === 'website' ||
      field === 'linkedin' ||
      field === 'github' ||
      field === 'summary'
    ) {
      const personalField = field.startsWith('personalInfo.')
        ? field.substring(14)
        : field;
      updatedResume.personalInfo[personalField] = value;
    }

    // Update state to trigger re-render
    setEditableResume(updatedResume);
  };

  const renderEditableFields = () => {
    if (!editableResume) return null;
    return (
      <div className="space-y-6 print:hidden">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Edit Resume</h3>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">
              Personal Information
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={editableResume.personalInfo.fullName}
                  onChange={(e) =>
                    handleFieldChange('fullName', e.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editableResume.personalInfo.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editableResume.personalInfo.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editableResume.personalInfo.location}
                  onChange={(e) =>
                    handleFieldChange('location', e.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editableResume.personalInfo.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={editableResume.personalInfo.linkedin || ''}
                  onChange={(e) =>
                    handleFieldChange('linkedin', e.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={editableResume.personalInfo.github || ''}
                  onChange={(e) => handleFieldChange('github', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={editableResume.personalInfo.summary || ''}
                  onChange={(e) => handleFieldChange('summary', e.target.value)}
                  className="w-full"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">
            Skills
          </h4>
          <div className="space-y-3">
            {editableResume.skills && editableResume.skills.length > 0 ? (
              editableResume.skills.map((skill: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) =>
                        handleFieldChange(
                          `skills[${index}].name`,
                          e.target.value
                        )
                      }
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <Input
                      value={skill.level}
                      onChange={(e) =>
                        handleFieldChange(
                          `skills[${index}].level`,
                          e.target.value
                        )
                      }
                      placeholder="Level"
                      className="w-24"
                    />
                  </div>
                  <Input
                    value={skill.category || ''}
                    onChange={(e) =>
                      handleFieldChange(
                        `skills[${index}].category`,
                        e.target.value
                      )
                    }
                    placeholder="Category"
                    className="w-full"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet</p>
            )}
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">
            Work Experience
          </h4>
          <div className="space-y-4">
            {editableResume.workExperience &&
            editableResume.workExperience.length > 0 ? (
              editableResume.workExperience.map((work: any, index: number) => (
                <div
                  key={work.id}
                  className="space-y-3 border-l-2 border-blue-200 pl-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={work.position}
                      onChange={(e) =>
                        handleFieldChange(
                          `workExperience[${index}].position`,
                          e.target.value
                        )
                      }
                      placeholder="Position"
                    />
                    <Input
                      value={work.company}
                      onChange={(e) =>
                        handleFieldChange(
                          `workExperience[${index}].company`,
                          e.target.value
                        )
                      }
                      placeholder="Company"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={work.startDate}
                      onChange={(e) =>
                        handleFieldChange(
                          `workExperience[${index}].startDate`,
                          e.target.value
                        )
                      }
                      placeholder="Start Date"
                    />
                    <Input
                      value={work.endDate || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          `workExperience[${index}].endDate`,
                          e.target.value
                        )
                      }
                      placeholder="End Date"
                    />
                  </div>
                  <Input
                    value={work.location}
                    onChange={(e) =>
                      handleFieldChange(
                        `workExperience[${index}].location`,
                        e.target.value
                      )
                    }
                    placeholder="Location"
                  />
                  <Textarea
                    value={work.description}
                    onChange={(e) =>
                      handleFieldChange(
                        `workExperience[${index}].description`,
                        e.target.value
                      )
                    }
                    placeholder="Job Description"
                    rows={3}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No work experience added yet
              </p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">
            Education
          </h4>
          <div className="space-y-4">
            {editableResume.education && editableResume.education.length > 0 ? (
              editableResume.education.map((edu: any, index: number) => (
                <div
                  key={edu.id}
                  className="space-y-3 border-l-2 border-green-200 pl-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        handleFieldChange(
                          `education[${index}].degree`,
                          e.target.value
                        )
                      }
                      placeholder="Degree"
                    />
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        handleFieldChange(
                          `education[${index}].institution`,
                          e.target.value
                        )
                      }
                      placeholder="Institution"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={edu.field}
                      onChange={(e) =>
                        handleFieldChange(
                          `education[${index}].field`,
                          e.target.value
                        )
                      }
                      placeholder="Field of Study"
                    />
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          `education[${index}].gpa`,
                          e.target.value
                        )
                      }
                      placeholder="GPA"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={edu.startDate}
                      onChange={(e) =>
                        handleFieldChange(
                          `education[${index}].startDate`,
                          e.target.value
                        )
                      }
                      placeholder="Start Date"
                    />
                    <Input
                      value={edu.endDate}
                      onChange={(e) =>
                        handleFieldChange(
                          `education[${index}].endDate`,
                          e.target.value
                        )
                      }
                      placeholder="End Date"
                    />
                  </div>
                  <Textarea
                    value={edu.description || ''}
                    onChange={(e) =>
                      handleFieldChange(
                        `education[${index}].description`,
                        e.target.value
                      )
                    }
                    placeholder="Description"
                    rows={2}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No education added yet</p>
            )}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">
            Projects
          </h4>
          <div className="space-y-4">
            {editableResume.projects && editableResume.projects.length > 0 ? (
              editableResume.projects.map((project: any, index: number) => (
                <div
                  key={project.id}
                  className="space-y-3 border-l-2 border-purple-200 pl-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={project.name}
                      onChange={(e) =>
                        handleFieldChange(
                          `projects[${index}].name`,
                          e.target.value
                        )
                      }
                      placeholder="Project Name"
                    />
                    <Input
                      value={project.url || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          `projects[${index}].url`,
                          e.target.value
                        )
                      }
                      placeholder="Project URL"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={project.startDate}
                      onChange={(e) =>
                        handleFieldChange(
                          `projects[${index}].startDate`,
                          e.target.value
                        )
                      }
                      placeholder="Start Date"
                    />
                    <Input
                      value={project.endDate || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          `projects[${index}].endDate`,
                          e.target.value
                        )
                      }
                      placeholder="End Date"
                    />
                  </div>
                  <Textarea
                    value={project.description}
                    onChange={(e) =>
                      handleFieldChange(
                        `projects[${index}].description`,
                        e.target.value
                      )
                    }
                    placeholder="Project Description"
                    rows={3}
                  />
                  <div>
                    <Label className="text-sm text-gray-600">
                      Technologies (comma-separated)
                    </Label>
                    <Input
                      value={
                        project.technologies
                          ? project.technologies.join(', ')
                          : ''
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          `projects[${index}].technologies`,
                          e.target.value
                            .split(',')
                            .map((tech) => tech.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="React, TypeScript, Node.js"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No projects added yet</p>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">
            Certifications
          </h4>
          <div className="space-y-4">
            {editableResume.certifications &&
            editableResume.certifications.length > 0 ? (
              editableResume.certifications.map((cert: any, index: number) => (
                <div
                  key={cert.id}
                  className="space-y-3 border-l-2 border-yellow-200 pl-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={cert.name}
                      onChange={(e) =>
                        handleFieldChange(
                          `certifications[${index}].name`,
                          e.target.value
                        )
                      }
                      placeholder="Certification Name"
                    />
                    <Input
                      value={cert.issuer}
                      onChange={(e) =>
                        handleFieldChange(
                          `certifications[${index}].issuer`,
                          e.target.value
                        )
                      }
                      placeholder="Issuer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={cert.date}
                      onChange={(e) =>
                        handleFieldChange(
                          `certifications[${index}].date`,
                          e.target.value
                        )
                      }
                      placeholder="Date"
                    />
                    <Input
                      value={cert.url || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          `certifications[${index}].url`,
                          e.target.value
                        )
                      }
                      placeholder="Certificate URL"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No certifications added yet
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderModernTemplate = (resumeData: any = resume) => {
    if (!resumeData) return null;
    return (
      <div id="resume-content" className="max-w-4xl mx-auto bg-white shadow-lg">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 bg-gray-900 text-white p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {resumeData.personalInfo.fullName}
              </h1>
              <p className="text-gray-300 text-sm">
                {resumeData.personalInfo.email}
              </p>
              <p className="text-gray-300 text-sm">
                {resumeData.personalInfo.phone}
              </p>
              <p className="text-gray-300 text-sm">
                {resumeData.personalInfo.location}
              </p>
              {resumeData.personalInfo.website && (
                <a
                  href={resumeData.personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline block"
                >
                  {resumeData.personalInfo.website}
                </a>
              )}
              {resumeData.personalInfo.linkedin && (
                <a
                  href={resumeData.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline block"
                >
                  LinkedIn
                </a>
              )}
              {resumeData.personalInfo.github && (
                <a
                  href={resumeData.personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline block"
                >
                  GitHub
                </a>
              )}
            </div>

            {resumeData.personalInfo.summary && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
                  Summary
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {resumeData.personalInfo.summary}
                </p>
              </div>
            )}

            {resumeData.skills && resumeData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
                  Skills
                </h3>
                <div className="space-y-3">
                  {resumeData.skills.map((skill: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {skill.level}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {skill.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="w-2/3 p-8">
            {/* Experience */}
            {resumeData.workExperience &&
              resumeData.workExperience.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-2">
                    Professional Experience
                  </h2>
                  <div className="space-y-6">
                    {resumeData.workExperience.map(
                      (work: any, _index: number) => (
                        <div key={work.id}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {work.position}
                              </h3>
                              <p className="text-gray-700 font-medium">
                                {work.company}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {work.startDate} - {work.endDate}
                              </p>
                              <p className="text-sm text-gray-500">
                                {work.location}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {work.description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-2">
                  Education
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu: any, _index: number) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {edu.degree}
                          </h3>
                          <p className="text-gray-700 font-medium">
                            {edu.institution}
                          </p>
                          <p className="text-gray-600 text-sm">{edu.field}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-gray-500">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-gray-600 text-sm">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-2">
                  Projects
                </h2>
                <div className="space-y-4">
                  {resumeData.projects.map((project: any, _index: number) => (
                    <div key={project.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.url ? (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {project.name}
                              </a>
                            ) : (
                              project.name
                            )}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {project.startDate} - {project.endDate || 'Present'}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map(
                          (tech: string, index: number) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications &&
              resumeData.certifications.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-2">
                    Certifications
                  </h2>
                  <div className="space-y-2">
                    {resumeData.certifications.map(
                      (cert: any, _index: number) => (
                        <div key={cert.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {cert.url ? (
                                  <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    {cert.name}
                                  </a>
                                ) : (
                                  cert.name
                                )}
                              </h3>
                              <p className="text-blue-600 font-medium">
                                {cert.issuer}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">{cert.date}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  const renderMinimalTemplate = (resumeData: any = resume) => {
    if (!resumeData) return null;
    return (
      <div id="resume-content" className="max-w-4xl mx-auto p-8 bg-white">
        {/* Minimal header */}
        <div className="border-b border-gray-300 pb-6 mb-8">
          <h1 className="text-3xl font-light text-gray-900">
            {resumeData.personalInfo.fullName}
          </h1>
          <div className="flex gap-8 text-gray-600">
            <span>{resumeData.personalInfo.email}</span>
            <span className="text-gray-400">•</span>
            <span>{resumeData.personalInfo.phone}</span>
            <span className="text-gray-400">•</span>
            <span>{resumeData.personalInfo.location}</span>
          </div>
        </div>

        {/* Minimal content */}
        <div className="space-y-8">
          {/* Single column for all content */}
          {resumeData.workExperience &&
            resumeData.workExperience.length > 0 && (
              <div>
                <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wide">
                  Experience
                </h2>
                <div className="space-y-6">
                  {resumeData.workExperience.map(
                    (work: any, _index: number) => (
                      <div
                        key={work.id}
                        className="border-l border-gray-300 pl-6"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {work.position}
                            </h3>
                            <p className="text-gray-700">{work.company}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>
                              {work.startDate} - {work.endDate}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {work.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {resumeData.education && resumeData.education.length > 0 && (
            <div>
              <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wide">
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu: any, _index: number) => (
                  <div key={edu.id} className="border-l border-gray-300 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-gray-700">{edu.institution}</p>
                        <p className="text-gray-600 text-sm">{edu.field}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>
                          {edu.startDate} - {edu.endDate}
                        </p>
                        {edu.gpa && <p>GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-gray-600 text-sm">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wide">
                Projects
              </h2>
              <div className="space-y-4">
                {resumeData.projects.map((project: any, _index: number) => (
                  <div
                    key={project.id}
                    className="border-l border-gray-300 pl-6"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {project.name}
                            </a>
                          ) : (
                            project.name
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {project.startDate} - {project.endDate || 'Present'}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map(
                        (tech: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.skills && resumeData.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wide">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill: any, index: number) => (
                  <span key={index} className="text-sm text-gray-700">
                    {skill.name}
                    {index < resumeData.skills.length - 1 && ' • '}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resumeData.certifications &&
            resumeData.certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wide">
                  Certifications
                </h2>
                <div className="space-y-2">
                  {resumeData.certifications.map(
                    (cert: any, _index: number) => (
                      <div
                        key={cert.id}
                        className="border-l border-gray-300 pl-6"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {cert.url ? (
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {cert.name}
                                </a>
                              ) : (
                                cert.name
                              )}
                            </h3>
                            <p className="text-gray-700">{cert.issuer}</p>
                          </div>
                          <p className="text-sm text-gray-500">{cert.date}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderTemplate = () => {
    // Use editableResume when editing, otherwise use original resume
    const resumeData = isEditing && editableResume ? editableResume : resume;

    switch (selectedTemplate) {
      case 'modern':
        return renderModernTemplate(resumeData);
      case 'minimal':
        return renderMinimalTemplate(resumeData);
      default:
        return renderModernTemplate(resumeData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Resume not found
          </h1>
          <p className="text-gray-600 mb-6">
            The resume you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => (window.location.href = '/resume')}>
            Back to Resumes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-full mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
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
        <div className="flex gap-6">
          {/* Left Sidebar - Edit Fields */}
          <div className="w-96 h-[calc(100vh-4rem)] flex flex-col print:hidden">
            <div className="flex-1 overflow-y-auto space-y-6 pb-6">
              {renderEditableFields()}
            </div>

            {/* Sticky Edit Button inside sidebar */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? 'outline' : 'default'}
                size="lg"
                className="w-full"
              >
                {isEditing ? 'Save Changes' : 'Enable Editing'}
              </Button>
            </div>
          </div>

          {/* Middle - Resume Preview */}
          <div className="flex-1 print:pr-0 max-w-5xl">{renderTemplate()}</div>

          {/* Right Sidebar - Download Options */}
          <div className="w-64 space-y-6 print:hidden">
            {/* Template Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Template</h3>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Download Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Download</h3>
              <div className="space-y-3">
                <Button onClick={handleDownloadPDF} className="w-full">
                  Download PDF
                </Button>
                <Button
                  onClick={handleDownloadDOCX}
                  variant="outline"
                  className="w-full"
                >
                  Download DOCX
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add print-specific styles to hide browser elements
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      @page {
        margin: 0;
        size: A4;
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      * {
        box-sizing: border-box;
      }
      
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      /* Hide all browser UI elements during print */
      header, footer, nav, aside {
        display: none !important;
      }
      
      /* Hide any elements with these classes */
      .print\\:hidden {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}
