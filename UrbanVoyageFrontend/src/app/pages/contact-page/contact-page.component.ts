import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as L from 'leaflet';
import { locations } from 'src/app/data/locations.data';
import {AgencyLocation} from "../../models/agency-location.model";
import {Contact} from "../../models/contact.model";
import {ContactService} from "../../services/contact.service";

Chart.register(...registerables);

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}


@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit  {
  @ViewChild('mapSection') mapSection!: ElementRef;

  private userGrowthChart: Chart | null = null

  loading: boolean = false;

  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    // Optionally, you can set a timer to clear the message after a few seconds
    setTimeout(() => this.closeMessage(), 5000); // Clear message after 5 seconds
  }
  closeMessage(): void {
    this.message = null;
  }

  faqs: FAQ[] = [
    {
      question: 'What is the cancellation policy?',
      answer: 'Our cancellation policy allows for full refunds up to 48 hours before the tour start time.',
      isOpen: false
    },
    {
      question: 'Do you offer group discounts?',
      answer: 'Yes, we offer group discounts for parties of 6 or more. Please contact us for more information.',
      isOpen: false
    },
    {
      question: 'What is included in the tour price?',
      answer: 'Our tour prices typically include transportation, guide services, and entrance fees to attractions. Meals and personal expenses are not included unless specified.',
      isOpen: false
    }
  ];



  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }

  ngOnInit() {
    this.initUserGrowthChart();
    this.initCitiesChart();
    this.initMap();
  }

  initChart() {
    const ctx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Number of Users',
          data: [1000, 500, 2800, 2500, 3000, 3500, 4000, 400, 800, 6500, 6300, 8500],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'User Growth Over Time'
          }
        }
      }
    });
  }

  map: any; // Declare map as any type


  locations = locations;


  initMap() {
    // Define a custom marker icon with cyan color
    const cyanIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [16, 27], // Adjusted icon size to 2/3 of the original
      iconAnchor: [8, 27], // Adjusted icon anchor to 2/3 of the original
      popupAnchor: [0, -22], // Adjusted popup anchor to 2/3 of the original
      shadowSize: [27, 27] // Adjusted shadow size to 2/3 of the original
    });


    this.map = L.map('map', {
      center: [32.4279, -6.3418], // Center map around Morocco initially
      zoom: 6,
      minZoom: 6,
      maxZoom: 18
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri World Imagery contributors'
    }).addTo(this.map);

    this.locations.forEach(location => {
      L.marker([location.lat, location.lng], { icon: cyanIcon })
        .addTo(this.map!)
        .bindPopup(`<b>${location.name}</b><br>${location.address}`);
    });

    const bounds = L.latLngBounds(this.locations.map(loc => [loc.lat, loc.lng]));
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  showLocationOnMap(location: AgencyLocation) {
    if (this.map) {
      this.map.flyTo([location.lat, location.lng], 14, {
        duration: 4,  // Animation duration in seconds
        easeLinearity: 0.5,  // Animation easing
        zoom: { animate: true }
      });

      // Scroll to the map section
      this.mapSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }



  cities = [
    { country: 'Casablanca', users: 5500 },
    { country: 'Rabat', users: 4800 },
    { country: 'Marrakech', users: 4200 },
    { country: 'Fes', users: 3800 },
    { country: 'Tangier', users: 3200 },
    { country: 'Agadir', users: 2800 },
    { country: 'Meknes', users: 2300 },
    { country: 'Oujda', users: 1800 },
    { country: 'Chefchaouen', users: 1500 },
    { country: 'Essaouira', users: 1200 }
  ];

  initUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
    if (this.userGrowthChart) {
      this.userGrowthChart.destroy();
    }
    this.userGrowthChart = new Chart(ctx,{
      type: 'line',
      data: {
        labels: this.generateMonthLabels(),
        datasets: this.cities.map(city => {
          const growthData = this.generateCityUserGrowth(city.users);
          return {
            label: city.country,
            data: growthData,
            borderColor: this.getRandomColor(),
            tension: 0.4,
            fill: false
          };
        })
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'User Growth Over Time'
          }
        }
      }
    });
  }

  generateCityUserGrowth(initialUsers: number): number[] {
    const growthData = [initialUsers];
    let currentValue = initialUsers;
    for (let i = 1; i < 36; i++) { // Simulate growth over 3 years (36 months)
      const randomChange = this.getRandomNumberInRange(-200, 300); // Random change between -200 and 300
      const growthFactor = 1 + randomChange / 10000; // Convert random change to growth factor

      currentValue = Math.round(currentValue * growthFactor);
      growthData.push(currentValue);
    }
    return growthData;
  }

  generateMonthLabels(): string[] {
    const labels = [];
    const currentDate = new Date();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    for (let i = 0; i < 36; i++) {
      labels.push(`${this.getMonthName(month)} ${year}`);
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
    return labels;
  }

  getMonthName(monthIndex: number): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[monthIndex];
  }

  getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomColor(): string {
    const r = 0; // Set red channel to 0 or a low value
    const g = Math.floor(Math.random() * 156);
    const b = Math.floor(Math.random() * 256);

    // Adjusting the values to create a cyan or teal-like color
    const cyanishColor = `rgb(${r}, ${g}, ${b})`;

    return cyanishColor;
  }



  initCitiesChart() {
    const ctx = document.getElementById('citiesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.cities.map(n => n.country),
        datasets: [{
          data: this.cities.map(n => n.users),
          backgroundColor: [
            'rgba(6, 182, 212, 0.8)',  // cyan-500
            'rgba(8, 145, 178, 0.8)',  // cyan-600
            'rgba(14, 116, 144, 0.8)', // cyan-700
            'rgba(21, 94, 117, 0.8)',  // cyan-800
            'rgba(22, 78, 99, 0.8)',   // cyan-900
          ],
          borderWidth: 0.5, // Decrease the width of the border
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20 // Add padding around the chart
        },
        plugins: {
          legend: {
            position: 'right' as const,
            labels: {
              padding: 20, // Add gap between pie chart and legend
            }
          },
          title: {
            display: true,
            text: 'Top User Cities'
          }
        },
        animation: {
          duration: 2000,
          loop: false,
        },
        animations: {
          rotation: {
            type: 'number',
            from: 0,
            to: 360,
            loop: true
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        elements: {
          arc: {
            borderWidth: 0,
            hoverBackgroundColor: 'rgba(6, 182, 212, 1)', // Cyan-500 at full opacity
            hoverBorderColor: 'white',
            hoverBorderWidth: 2,
          }
        }
      },
      plugins: [{
        id: 'hoverEffect',
        beforeDraw: (chart: Chart) => {
          const activeElements = chart.getActiveElements();
          if (activeElements.length > 0) {
            const { ctx } = chart;
            const activeElement = activeElements[0];
            const dataset = chart.data.datasets[activeElement.datasetIndex];
            const meta = chart.getDatasetMeta(activeElement.datasetIndex);
            const arc = meta.data[activeElement.index] as any;

            if (dataset.backgroundColor && Array.isArray(dataset.backgroundColor)) {
              ctx.save();
              ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
              ctx.shadowBlur = 10;
              ctx.shadowOffsetX = 5;
              ctx.shadowOffsetY = 5;

              const model = arc.getProps(['startAngle', 'endAngle', 'innerRadius', 'outerRadius']);
              ctx.beginPath();
              ctx.arc(
                arc.x,
                arc.y,
                model.outerRadius * 1.05, // Scale to 105%
                model.startAngle,
                model.endAngle
              );
              ctx.arc(
                arc.x,
                arc.y,
                model.innerRadius,
                model.endAngle,
                model.startAngle,
                true
              );
              ctx.closePath();
              ctx.fillStyle = dataset.backgroundColor[activeElement.index] as string;
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }]
    });
  }



  contact: Contact = {
    fullName: '',
    email: '',
    message: '',
    createdAt: new Date(),
    read: false
  };

  constructor(private contactService: ContactService) { }

  onSubmit() {
    this.loading = true;

    this.contactService.createContact(this.contact).subscribe(
      response => {
        this.loading = false;
        this.showMessage('Message sent successfully.', 'success');
        console.log('Message sent successfully', response);
        // Reset the form
        this.contact = {
          fullName: '',
          email: '',
          message: '',
          createdAt: new Date(),
          read:false
        };
      },
      error => {
        this.loading = false;
        this.showMessage('Error sending message.', 'error');
        console.error('Error saving contact', error);
      }
    );
  }
}
