import { Injectable, signal } from '@angular/core';
import { Course, CourseWithId } from '../interfaces/courseInterface';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {

  selectedCourses = signal<CourseWithId[]>([]);

  constructor() {
    this.loadCourses();
  }

  addCourse(course: CourseWithId): void {

    //Kontrollerar att kursen inte redan finns
    const courseExists = this.selectedCourses().some(
      selected => selected.id === course.id
    );

    if (courseExists) return;

    //Uppdatera signalen
    this.selectedCourses.update(courses => [...courses, course]);

    this.saveCourses();

  };

  saveCourses(): void {
    localStorage.setItem("selectedCourses", JSON.stringify(this.selectedCourses()))
  };

  loadCourses(): void {
    const savedCourses = localStorage.getItem("selectedCourses");

    console.log("localStorage:", savedCourses);

    if (savedCourses) {
      this.selectedCourses.set(JSON.parse(savedCourses))
    }

    console.log("Inlästa kurser:", this.selectedCourses());
  };

  removeCourse(id: number): void {

    this.selectedCourses.update(courses => courses.filter(course => course.id !== id)
  ); 

  this.saveCourses(); 
  }

}
