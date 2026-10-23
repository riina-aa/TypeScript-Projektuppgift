export interface Course {
    courseCode: string, 
    courseName: string, 
    points: number, 
    level: string, 
    subject: string, 
    syllabus: string
}

export interface CourseWithId extends Course {
    id: number; 
}