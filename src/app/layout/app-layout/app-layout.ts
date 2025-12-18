import { Component } from '@angular/core';
import { Sidebar } from '../utilities/sidebar/sidebar';
import { Header } from '../utilities/header/header';
import { Dashboard } from "../../pages/dashboard/dashboard";

@Component({
  selector: 'app-app-layout',
  imports: [Sidebar, Header, Dashboard],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',


})
export class AppLayout {

}
