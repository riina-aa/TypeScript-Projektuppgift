import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Course } from '../interfaces/courseInterface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {

  private url = "/miun_courses.json";

  http = inject(HttpClient);

  //Hämta kurser 
  async fetchCourses(): Promise<Course[]> {
    const courses = this.http.get<Course[]>(this.url);
    return await firstValueFrom(courses);
  }

}
