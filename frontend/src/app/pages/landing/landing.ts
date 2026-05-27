import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Footer, Navbar],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {}
