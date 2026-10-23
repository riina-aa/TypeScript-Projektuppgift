import { Component, computed, inject } from '@angular/core';
import { ScheduleService } from '../../services/schedule-service';

@Component({
  selector: 'app-schedule',
  imports: [],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule {

  scheduleService = inject(ScheduleService);

  removeFromSchedule(id: number): void {
    this.scheduleService.removeCourse(id);
  }

  totalPoints = computed(() => {
    return this.scheduleService.selectedCourses().reduce(
      (total, course) => total + course.points, 0
    ); 
  });

}
