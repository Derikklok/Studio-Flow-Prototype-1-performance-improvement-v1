import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-master',
  imports: [RouterLink],
  templateUrl: './master.html',
  styleUrl: './master.css',
})
export class Master {
  currentComponent: string = 'Roles';
}
