import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Course, CourseWithId } from '../interfaces/courseInterface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {

  private url = "/miun_courses.json";
  http = inject(HttpClient);

  // Lagrar alla kurser
  courses = signal<CourseWithId[]>([]);

  //Hämta kurser 
  async fetchCourses(): Promise<void> {

    // Om kurserna redan finns behöver vi inte hämta igen
    if (this.courses().length > 0) return;

    try {
        const data = await firstValueFrom(this.http.get<Course[]>(this.url));
        
        const coursesWithId = data.map((course, index) => ({
          ...course, 
          id: index
        })); 

        this.courses.set(coursesWithId); 

    } catch (error) {
        console.error("Kunde inte hämta kurser " + error); 
    }
  }
}
