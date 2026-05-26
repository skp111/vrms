import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink, Navbar],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome {}
