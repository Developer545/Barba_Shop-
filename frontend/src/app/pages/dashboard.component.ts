import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { User, UserRole } from '../models/user.model';
import { Service, ServiceCategory } from '../models/service.model';
import { Barber } from '../models/barber.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, FullCalendarModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <!-- Navigation Header -->
      <nav class="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <span class="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">BarberShop</span>
            </div>

            <div class="flex items-center space-x-4">
              <!-- User Info -->
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">{{ currentUser?.name }}</p>
                  <p class="text-xs text-indigo-600 font-medium">{{ currentUser?.role }}</p>
                </div>
                <div class="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-indigo-200">
                  <span class="text-white font-bold text-sm">
                    {{ currentUser?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
              </div>

              <!-- Logout Button -->
              <button
                (click)="logout()"
                class="text-gray-500 hover:text-red-600 transition-all duration-200 p-2 hover:bg-red-50 rounded-lg"
                title="Cerrar sesión"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Welcome Section -->
        <div class="mb-10 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ¡Bienvenido, {{ currentUser?.name }}!
          </h1>
          <p class="text-gray-700 mt-3 text-lg font-medium">
            <span *ngIf="currentUser?.role === 'admin'" class="flex items-center gap-2">
              <svg class="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              Panel de administración - Control total del sistema
            </span>
            <span *ngIf="currentUser?.role === 'barber'" class="flex items-center gap-2">
              <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Panel de barbero - Gestiona tus citas y clientes
            </span>
            <span *ngIf="currentUser?.role === 'client'" class="flex items-center gap-2">
              <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
              Panel de cliente - Reserva y gestiona tus citas
            </span>
          </p>
        </div>

        <!-- Role-specific Content -->
        <!-- ADMIN VIEW -->
        <div *ngIf="currentUser?.role === 'admin'">
          <!-- Admin Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">{{ totalUsers }}</h3>
                <p class="text-white/90 text-sm font-medium">Usuarios Totales</p>
              </div>
            </div>

            <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">{{ totalBarbers }}</h3>
                <p class="text-white/90 text-sm font-medium">Barberos Activos</p>
              </div>
            </div>

            <div class="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">\${{ monthlyRevenue }}</h3>
                <p class="text-white/90 text-sm font-medium">Ingresos del Mes</p>
              </div>
            </div>

            <div class="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">{{ totalAppointments }}</h3>
                <p class="text-white/90 text-sm font-medium">Citas Este Mes</p>
              </div>
            </div>
          </div>

          <!-- Admin Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-red-100 hover:border-red-300 transform hover:-translate-y-1" (click)="createNewBarber()">
              <div class="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-gradient-to-br from-red-400/20 to-pink-500/20 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">Crear Barbero</h3>
                  <p class="text-sm text-gray-600">Agregar nuevo barbero al equipo</p>
                </div>
                <div class="h-14 w-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-300 transform hover:-translate-y-1" (click)="openServiceModal()">
              <div class="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">Crear Servicio</h3>
                  <p class="text-sm text-gray-600">Agregar servicios con precios</p>
                </div>
                <div class="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 transform hover:-translate-y-1" (click)="openUserManagement()">
              <div class="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">Gestionar Usuarios</h3>
                  <p class="text-sm text-gray-600">Crear usuarios y asignar roles</p>
                </div>
                <div class="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabbed Tables Section -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 overflow-hidden mb-8">
            <!-- Tab Navigation -->
            <div class="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-b border-indigo-100">
              <nav class="flex space-x-2 p-2">
                <button *ngFor="let tab of tabs"
                        (click)="setActiveTab(tab.id)"
                        [class]="activeTab === tab.id ?
                          'bg-white shadow-lg text-indigo-600 px-4 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all duration-300 transform scale-105' :
                          'text-gray-600 hover:text-indigo-600 hover:bg-white/50 px-4 py-3 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="tab.icon"/>
                  </svg>
                  <span>{{ tab.name }}</span>
                  <span *ngIf="tab.id === 'barberos'" class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">{{ totalBarbers }}</span>
                  <span *ngIf="tab.id === 'servicios'" class="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">{{ totalServices }}</span>
                  <span *ngIf="tab.id === 'usuarios'" class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">{{ users.length }}</span>
                  <span *ngIf="tab.id === 'citas'" class="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">{{ appointments.length }}</span>
                </button>
              </nav>
            </div>

            <!-- Page Size Selector -->
            <div class="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-indigo-100">
              <div class="flex items-center space-x-4">
                <span class="text-sm font-semibold text-gray-700">Mostrar:</span>
                <select (change)="onPageSizeChange($event)" [value]="pageSize"
                        class="border-2 border-indigo-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:border-indigo-300 transition-all duration-200 cursor-pointer shadow-sm">
                  <option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</option>
                  <option value="999999">Todos</option>
                </select>
                <span class="text-sm font-medium text-gray-600">registros por página</span>
              </div>

              <div class="text-sm text-gray-700">
                <span *ngIf="activeTab === 'barberos'">{{ getBarberPaginationInfo() }}</span>
                <span *ngIf="activeTab === 'servicios'">{{ getServicePaginationInfo() }}</span>
                <span *ngIf="activeTab === 'usuarios'">{{ getUserPaginationInfo() }}</span>
              </div>
            </div>

            <!-- Tab Content -->
            <!-- BARBEROS TAB -->
            <div *ngIf="activeTab === 'barberos'" class="tab-content">
              <div class="overflow-x-auto">
                <table class="w-full table-auto">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Barbero</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Especialidades</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Experiencia</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let barber of paginatedBarbers" class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="py-4 px-4">
                        <div class="flex items-center space-x-3">
                          <img [src]="barber.avatar" [alt]="barber.name" class="w-10 h-10 rounded-full object-cover">
                          <div>
                            <p class="font-medium text-gray-900">{{ barber.name }}</p>
                            <p class="text-sm text-gray-600">{{ barber.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <span *ngFor="let specialty of barber.specialties.slice(0, 2)"
                                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {{ specialty }}
                          </span>
                          <span *ngIf="barber.specialties.length > 2"
                                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{{ barber.specialties.length - 2 }}
                          </span>
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <span class="text-gray-700">{{ barber.experience }} años</span>
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex items-center space-x-1">
                          <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span class="text-gray-700 text-sm">{{ barber.rating }}</span>
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <span [class]="barber.isActive ? 'px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full' : 'px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'">
                          {{ barber.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex space-x-2">
                          <button (click)="viewBarberDetails(barber)"
                                  class="action-btn view-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            Ver detalles
                          </button>
                          <button (click)="editBarber(barber)"
                                  class="action-btn edit-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Editar
                          </button>
                          <button (click)="toggleBarberStatus(barber)"
                                  [class]="barber.isActive ? 'action-btn deactivate-btn' : 'action-btn activate-btn'">
                            <svg *ngIf="barber.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
                            </svg>
                            <svg *ngIf="!barber.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ barber.isActive ? 'Desactivar' : 'Activar' }}
                          </button>
                          <button (click)="deleteBarber(barber)"
                                  class="action-btn delete-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div *ngIf="barbers.length === 0" class="text-center py-8">
                  <p class="text-gray-500">No hay barberos registrados</p>
                  <button (click)="createNewBarber()" class="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                    Crear primer barbero
                  </button>
                </div>
              </div>

              <!-- Paginación para Barberos -->
              <div *ngIf="barberTotalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div class="flex items-center space-x-2">
                  <button (click)="previousBarberPage()"
                          [disabled]="barberCurrentPage === 1"
                          [class]="barberCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
                          class="px-3 py-2 text-sm border border-gray-300 rounded-md">
                    Anterior
                  </button>

                  <button *ngFor="let page of getPageNumbers(barberCurrentPage, barberTotalPages)"
                          (click)="goToBarberPage(page)"
                          [class]="page === barberCurrentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
                          class="px-3 py-2 text-sm border border-gray-300 rounded-md">
                    {{ page }}
                  </button>

                  <button (click)="nextBarberPage()"
                          [disabled]="barberCurrentPage === barberTotalPages"
                          [class]="barberCurrentPage === barberTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
                          class="px-3 py-2 text-sm border border-gray-300 rounded-md">
                    Siguiente
                  </button>
                </div>

                <span class="text-sm text-gray-700">
                  Página {{ barberCurrentPage }} de {{ barberTotalPages }}
                </span>
              </div>
            </div>

            <!-- SERVICIOS TAB -->
            <div *ngIf="activeTab === 'servicios'" class="tab-content">
              <div class="overflow-x-auto">
                <table class="w-full table-auto">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Servicio</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Categoría</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Precio</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Duración</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let service of paginatedServices" class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="py-4 px-4">
                        <div class="flex items-center space-x-3">
                          <img [src]="service.image" [alt]="service.name" class="w-12 h-12 rounded-lg object-cover">
                          <div>
                            <p class="font-medium text-gray-900">{{ service.name }}</p>
                            <p class="text-sm text-gray-600">{{ service.description }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <span [class]="getCategoryBadgeClass(service.category || ServiceCategory.HAIRCUT)">
                          {{ getCategoryDisplayName(service.category || ServiceCategory.HAIRCUT) }}
                        </span>
                      </td>
                      <td class="py-4 px-4">
                        <span class="font-medium text-gray-900">\${{ service.price }}</span>
                      </td>
                      <td class="py-4 px-4">
                        <span class="text-gray-700">{{ service.duration }} min</span>
                      </td>
                      <td class="py-4 px-4">
                        <span [class]="service.isActive ? 'px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full' : 'px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'">
                          {{ service.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex space-x-2">
                          <button (click)="editService(service)"
                                  class="action-btn edit-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Editar
                          </button>
                          <button (click)="toggleServiceStatus(service)"
                                  [class]="service.isActive ? 'action-btn deactivate-btn' : 'action-btn activate-btn'">
                            <svg *ngIf="service.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
                            </svg>
                            <svg *ngIf="!service.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ service.isActive ? 'Desactivar' : 'Activar' }}
                          </button>
                          <button (click)="deleteService(service)" class="action-btn delete-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div *ngIf="services.length === 0" class="text-center py-8">
                  <p class="text-gray-500">No hay servicios registrados</p>
                  <button (click)="openServiceModal()" class="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                    Crear primer servicio
                  </button>
                </div>
              </div>

              <!-- Paginación para Servicios -->
              <div *ngIf="serviceTotalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div class="flex items-center space-x-2">
                  <button (click)="previousServicePage()"
                          [disabled]="serviceCurrentPage === 1"
                          [class]="serviceCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
                          class="px-3 py-2 text-sm border border-gray-300 rounded-md">
                    Anterior
                  </button>

                  <button *ngFor="let page of getPageNumbers(serviceCurrentPage, serviceTotalPages)"
                          (click)="goToServicePage(page)"
                          [class]="page === serviceCurrentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
                          class="px-3 py-2 text-sm border border-gray-300 rounded-md">
                    {{ page }}
                  </button>

                  <button (click)="nextServicePage()"
                          [disabled]="serviceCurrentPage === serviceTotalPages"
                          [class]="serviceCurrentPage === serviceTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
                          class="px-3 py-2 text-sm border border-gray-300 rounded-md">
                    Siguiente
                  </button>
                </div>

                <span class="text-sm text-gray-700">
                  Página {{ serviceCurrentPage }} de {{ serviceTotalPages }}
                </span>
              </div>
            </div>

            <!-- HORARIOS TAB -->
            <div *ngIf="activeTab === 'horarios'" class="tab-content">
              <div class="p-6">
                <div class="mb-6">
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">Gestión de Horarios</h2>
                  <p class="text-gray-600">Configura horarios semanales y excepciones para cada barbero</p>
                </div>

                <!-- Seleccionar Barbero -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-3">Seleccionar Barbero</label>
                  <select [(ngModel)]="selectedBarberForSchedule" (change)="loadBarberScheduleData()"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option [value]="null">-- Seleccione un barbero --</option>
                    <option *ngFor="let barber of barbers" [value]="barber.id">
                      {{ barber.name }}
                    </option>
                  </select>
                </div>

                <!-- Contenido cuando NO hay barbero seleccionado -->
                <div *ngIf="!selectedBarberForSchedule" class="text-center py-16 bg-gray-50 rounded-lg">
                  <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <h3 class="mt-4 text-lg font-medium text-gray-900">Selecciona un barbero</h3>
                  <p class="mt-2 text-sm text-gray-500">Elige un barbero del menú desplegable para gestionar sus horarios</p>
                </div>

                <!-- Contenido cuando SÍ hay barbero seleccionado -->
                <div *ngIf="selectedBarberForSchedule" class="space-y-6">

                  <!-- SECCIÓN 1: Horario Semanal Base -->
                  <div class="bg-white rounded-lg shadow-sm">
                    <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div class="flex justify-between items-center">
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Horario Semanal Base
                          </h3>
                          <p class="text-sm text-gray-600 mt-1">Horario recurrente de trabajo del barbero</p>
                        </div>
                        <button (click)="openWeekScheduleModal()"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          Editar Horario
                        </button>
                      </div>
                    </div>

                    <!-- Tarjetas de días (vista compacta) -->
                    <div class="p-6">
                      <div class="grid grid-cols-7 gap-3">
                        <div *ngFor="let day of weekDays"
                             [class]="getScheduleForDay(day.value)?.isAvailable ?
                               'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'"
                             class="border-2 rounded-lg p-3 text-center transition-all hover:shadow-md">
                          <div class="text-xs font-semibold text-gray-700 mb-2">{{ day.shortName }}</div>
                          <div class="text-xs text-gray-600 mb-1">
                            {{ getScheduleForDay(day.value)?.startTime || '--' }}
                          </div>
                          <div class="text-xs text-gray-600 mb-2">
                            {{ getScheduleForDay(day.value)?.endTime || '--' }}
                          </div>
                          <div class="text-xs">
                            <span *ngIf="getScheduleForDay(day.value)?.isAvailable"
                                  class="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              ✓ Trabaja
                            </span>
                            <span *ngIf="!getScheduleForDay(day.value) || !getScheduleForDay(day.value)?.isAvailable"
                                  class="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                              ✕ Libre
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Info adicional -->
                      <div class="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div class="flex items-start gap-2">
                          <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <div class="flex-1">
                            <p class="text-sm text-blue-900 font-medium">Horario base semanal</p>
                            <p class="text-xs text-blue-700 mt-1">Este es el horario recurrente. Para excepciones específicas (días libres, ausencias, horarios especiales), usa el calendario de abajo.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- SECCIÓN 2: Calendario de Excepciones -->
                  <div class="bg-white rounded-lg shadow-sm">
                    <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div class="flex justify-between items-center">
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Calendario de Excepciones
                          </h3>
                          <p class="text-sm text-gray-600 mt-1">Días libres, ausencias y horarios especiales</p>
                        </div>
                        <button (click)="openExceptionModal()"
                                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                          Nueva Excepción
                        </button>
                      </div>
                    </div>

                    <div class="p-6">
                      <!-- FullCalendar -->
                      <div class="calendar-container mb-4">
                        <full-calendar [options]="calendarOptions"></full-calendar>
                      </div>

                      <!-- Leyenda mejorada -->
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center gap-3 bg-white p-2 rounded-md shadow-sm">
                          <div class="w-4 h-4 rounded" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"></div>
                          <div>
                            <div class="text-xs font-semibold text-gray-900">✓ Disponible</div>
                            <div class="text-xs text-gray-500">Día de trabajo</div>
                          </div>
                        </div>
                        <div class="flex items-center gap-3 bg-white p-2 rounded-md shadow-sm">
                          <div class="w-4 h-4 rounded" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);"></div>
                          <div>
                            <div class="text-xs font-semibold text-gray-900">⭐ Especial</div>
                            <div class="text-xs text-gray-500">Horario especial</div>
                          </div>
                        </div>
                        <div class="flex items-center gap-3 bg-white p-2 rounded-md shadow-sm">
                          <div class="w-4 h-4 rounded" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);"></div>
                          <div>
                            <div class="text-xs font-semibold text-gray-900">✕ Ausencia</div>
                            <div class="text-xs text-gray-500">No disponible</div>
                          </div>
                        </div>
                        <div class="flex items-center gap-3 bg-white p-2 rounded-md shadow-sm">
                          <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
                          </svg>
                          <div>
                            <div class="text-xs font-semibold text-gray-900">Click en día</div>
                            <div class="text-xs text-gray-500">Crear excepción</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CITAS TAB -->
            <div *ngIf="activeTab === 'citas'" class="tab-content">
              <div class="text-center py-16">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Gestión de Citas</h3>
                <p class="mt-2 text-sm text-gray-500">La funcionalidad de gestión de citas estará disponible próximamente.</p>
                <div class="mt-6">
                  <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Ver Citas
                  </button>
                </div>
              </div>
            </div>

            <!-- USUARIOS TAB -->
            <div *ngIf="activeTab === 'usuarios'" class="tab-content">
              <div class="overflow-x-auto">
                <table class="w-full table-auto">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let user of paginatedUsers" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <img class="h-10 w-10 rounded-full" [src]="user.avatar" [alt]="user.name">
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ user.email }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ user.phone || 'N/A' }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                              [ngClass]="{
                                'bg-red-100 text-red-800': user.role === 'ADMIN',
                                'bg-blue-100 text-blue-800': user.role === 'BARBER',
                                'bg-green-100 text-green-800': user.role === 'CLIENT'
                              }">
                          {{ user.role }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                              [ngClass]="{
                                'bg-green-100 text-green-800': user.isActive,
                                'bg-red-100 text-red-800': !user.isActive
                              }">
                          {{ user.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                          <button (click)="openUserModal(user)" class="action-btn edit-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Editar
                          </button>
                          <button (click)="toggleUserStatus(user.id, !user.isActive)"
                                  [class]="user.isActive ? 'action-btn deactivate-btn' : 'action-btn activate-btn'">
                            <svg *ngIf="user.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
                            </svg>
                            <svg *ngIf="!user.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ user.isActive ? 'Desactivar' : 'Activar' }}
                          </button>
                          <button (click)="deleteUser(user)" class="action-btn delete-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Empty state -->
                <div *ngIf="paginatedUsers.length === 0" class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
                  <p class="mt-1 text-sm text-gray-500">Comienza creando tu primer usuario.</p>
                  <div class="mt-6">
                    <button (click)="openUserModal()" type="button" class="btn-primary">
                      <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      Crear Usuario
                    </button>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div *ngIf="totalUsers > usersPerPage" class="mt-6 flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Mostrando {{ (currentUserPage - 1) * usersPerPage + 1 }} a {{ Math.min(currentUserPage * usersPerPage, totalUsers) }} de {{ totalUsers }} usuarios
                  </p>
                </div>
                <div class="flex space-x-2">
                  <button (click)="previousUserPage()" [disabled]="currentUserPage === 1"
                          class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                  </button>
                  <span class="px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-md">
                    {{ currentUserPage }} de {{ Math.ceil(totalUsers / usersPerPage) }}
                  </span>
                  <button (click)="nextUserPage()" [disabled]="currentUserPage >= Math.ceil(totalUsers / usersPerPage)"
                          class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- BARBER VIEW -->
        <div *ngIf="currentUser?.role === 'barber'">
          <!-- Barber Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">{{ myAppointmentsToday }}</h3>
                <p class="text-white/90 text-sm font-medium">Mis Citas Hoy</p>
              </div>
            </div>

            <div class="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">\${{ myDailyEarnings }}</h3>
                <p class="text-white/90 text-sm font-medium">Ingresos Hoy</p>
              </div>
            </div>

            <div class="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">{{ myClients }}</h3>
                <p class="text-white/90 text-sm font-medium">Clientes Atendidos</p>
              </div>
            </div>
          </div>

          <!-- Barber Tabbed Section -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 overflow-hidden mb-8">
            <!-- Tab Navigation -->
            <div class="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-b border-indigo-100">
              <nav class="flex space-x-2 p-2">
                <button *ngFor="let tab of barberTabs"
                        (click)="activeBarberTab = tab.id"
                        [class]="activeBarberTab === tab.id ?
                          'bg-white shadow-lg text-indigo-600 px-4 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all duration-300 transform scale-105' :
                          'text-gray-600 hover:text-indigo-600 hover:bg-white/50 px-4 py-3 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="tab.icon"/>
                  </svg>
                  <span>{{ tab.name }}</span>
                  <span *ngIf="tab.id === 'mis-citas'" class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">{{ myAppointmentsToday }}</span>
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- Mis Citas Tab -->
              <div *ngIf="activeBarberTab === 'mis-citas'" class="tab-content">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Mi Agenda de Hoy</h3>
                <div class="space-y-4">
                  <div class="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-200">
                          <span class="text-white font-bold text-sm">JP</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 text-lg">Juan Pérez</p>
                          <p class="text-sm text-gray-600 font-medium">Corte + Barba</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-gray-900 text-lg">10:30 AM</p>
                        <span class="inline-flex items-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md">
                          Confirmada
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="group relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-green-200">
                          <span class="text-white font-bold text-sm">CL</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 text-lg">Carlos López</p>
                          <p class="text-sm text-gray-600 font-medium">Corte Clásico</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-gray-900 text-lg">2:00 PM</p>
                        <span class="inline-flex items-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-md">
                          En Proceso
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="group relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-purple-200">
                          <span class="text-white font-bold text-sm">MR</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 text-lg">María Rodríguez</p>
                          <p class="text-sm text-gray-600 font-medium">Corte Fade</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-gray-900 text-lg">4:30 PM</p>
                        <span class="inline-flex items-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-md">
                          Pendiente
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mis Horarios Tab -->
              <div *ngIf="activeBarberTab === 'mis-horarios'" class="tab-content">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Mis Horarios de Trabajo</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-lg font-bold text-gray-900">Lunes - Viernes</h4>
                      <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <p class="text-gray-700 font-semibold">9:00 AM - 6:00 PM</p>
                    <div class="mt-3 flex items-center space-x-2">
                      <span class="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-md">Activo</span>
                    </div>
                  </div>

                  <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-lg font-bold text-gray-900">Sábado</h4>
                      <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <p class="text-gray-700 font-semibold">10:00 AM - 3:00 PM</p>
                    <div class="mt-3 flex items-center space-x-2">
                      <span class="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-md">Activo</span>
                    </div>
                  </div>

                  <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border-2 border-gray-200 shadow-md opacity-60">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-lg font-bold text-gray-900">Domingo</h4>
                      <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <p class="text-gray-700 font-semibold">Cerrado</p>
                    <div class="mt-3 flex items-center space-x-2">
                      <span class="px-3 py-1 text-xs font-bold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full shadow-md">Inactivo</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mi Perfil Tab -->
              <div *ngIf="activeBarberTab === 'mi-perfil'" class="tab-content">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Mi Perfil</h3>
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-md">
                  <div class="flex items-start space-x-6">
                    <div class="relative">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed={{ currentUser?.name }}" alt="Perfil" class="w-24 h-24 rounded-full border-4 border-white shadow-lg">
                      <div class="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded-full border-4 border-white"></div>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-2xl font-bold text-gray-900 mb-2">{{ currentUser?.name }}</h4>
                      <p class="text-gray-600 font-medium mb-4">Barbero Profesional</p>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white rounded-lg p-3 shadow-sm">
                          <p class="text-sm text-gray-600 font-medium">Email</p>
                          <p class="text-gray-900 font-semibold">{{ currentUser?.email }}</p>
                        </div>
                        <div class="bg-white rounded-lg p-3 shadow-sm">
                          <p class="text-sm text-gray-600 font-medium">Especialidades</p>
                          <p class="text-gray-900 font-semibold">Corte, Barba, Fade</p>
                        </div>
                        <div class="bg-white rounded-lg p-3 shadow-sm">
                          <p class="text-sm text-gray-600 font-medium">Experiencia</p>
                          <p class="text-gray-900 font-semibold">5+ años</p>
                        </div>
                        <div class="bg-white rounded-lg p-3 shadow-sm">
                          <p class="text-sm text-gray-600 font-medium">Calificación</p>
                          <p class="text-gray-900 font-semibold">⭐ 4.9/5.0</p>
                        </div>
                      </div>
                      <button class="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                        Editar Perfil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CLIENT VIEW -->
        <div *ngIf="currentUser?.role === 'client'">
          <!-- Client Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">{{ myTotalVisits }}</h3>
                <p class="text-white/90 text-sm font-medium">Visitas Totales</p>
              </div>
            </div>

            <div class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">{{ myUpcomingAppointments }}</h3>
                <p class="text-white/90 text-sm font-medium">Próximas Citas</p>
              </div>
            </div>

            <div class="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              <div class="relative p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">{{ myFavoriteBarber }}</h3>
                <p class="text-white/90 text-sm font-medium">Barbero Favorito</p>
              </div>
            </div>
          </div>

          <!-- Client Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" (click)="openAppointmentModal()">
              <div class="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative p-6 flex items-center justify-between">
                <div>
                  <h3 class="text-2xl font-bold text-white mb-2">Reservar Cita</h3>
                  <p class="text-white/90 text-sm font-medium">Agenda tu próxima visita</p>
                </div>
                <div class="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div class="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500"></div>
              <div class="relative p-6 flex items-center justify-between">
                <div>
                  <h3 class="text-2xl font-bold text-white mb-2">Mis Citas</h3>
                  <p class="text-white/90 text-sm font-medium">Ver citas programadas</p>
                </div>
                <div class="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Mi Próxima Cita -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 p-6 mb-8">
            <h3 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">Mi Próxima Cita</h3>
            <div class="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=barber" alt="Barbero" class="w-16 h-16 rounded-full border-4 border-white shadow-lg">
                    <div class="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-lg">Miguel Barbero</p>
                    <p class="text-sm text-gray-700 font-semibold mt-1">Corte + Barba</p>
                    <div class="flex items-center mt-2 space-x-2">
                      <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <p class="text-sm text-green-700 font-bold">Mañana, 15 de Octubre - 10:30 AM</p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-2">
                  <button class="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:from-red-200 hover:to-pink-200 border-2 border-red-200 hover:border-red-300 transition-all duration-200 transform hover:scale-105 shadow-md">
                    Cancelar
                  </button>
                  <button class="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Reagendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para Crear Barbero -->
      <div *ngIf="showBarberModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/40 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gradient-to-r from-indigo-100 to-purple-100">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{{ editingBarber ? 'Editar Barbero' : 'Crear Nuevo Barbero' }}</h2>
            <button (click)="closeBarberModalModified()" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-110 shadow-md">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form [formGroup]="barberForm" (ngSubmit)="onSubmitBarberModified()">
            <div class="space-y-4">
              <!-- Selector de Avatar -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div class="flex items-center space-x-4">
                  <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img [src]="barberForm.value.avatar" alt="Avatar" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <select formControlName="avatar" class="input-field">
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=default">Avatar por defecto</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber">Avatar 1</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=MiguelGarcia">Avatar 2</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosLopez">Avatar 3</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=RobertoMartinez">Avatar 4</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber1">Avatar 5</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber2">Avatar 6</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber3">Avatar 7</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber4">Avatar 8</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber5">Avatar 9</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber6">Avatar 10</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber7">Avatar 11</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber8">Avatar 12</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber9">Avatar 13</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber10">Avatar 14</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber11">Avatar 15</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber12">Avatar 16</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber13">Avatar 17</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber14">Avatar 18</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber15">Avatar 19</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber16">Avatar 20</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber17">Avatar 21</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber18">Avatar 22</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=DiegoSanchez">Avatar 23</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRodriguez">Avatar 24</option>
                      <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=FernandoLopez">Avatar 25</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input type="text" formControlName="name" class="input-field" placeholder="Ej: Miguel García">
                <div *ngIf="barberForm.get('name')?.invalid && barberForm.get('name')?.touched" class="text-red-500 text-sm mt-1">
                  El nombre es requerido
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" formControlName="email" class="input-field" placeholder="miguel@barbershop.com">
                <div *ngIf="barberForm.get('email')?.invalid && barberForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                  Email válido requerido
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="tel" formControlName="phone" class="input-field" placeholder="+503 7000-0000">
                <div *ngIf="barberForm.get('phone')?.invalid && barberForm.get('phone')?.touched" class="text-red-500 text-sm mt-1">
                  El teléfono es requerido
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Años de experiencia</label>
                <input type="number" formControlName="experience" class="input-field" placeholder="5">
                <div *ngIf="barberForm.get('experience')?.invalid && barberForm.get('experience')?.touched" class="text-red-500 text-sm mt-1">
                  La experiencia es requerida
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Especialidades (separadas por comas)</label>
                <input type="text" formControlName="specialties" class="input-field" placeholder="Corte clásico, Barba, Fade">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea formControlName="description" class="input-field" rows="3" placeholder="Breve descripción del barbero..."></textarea>
              </div>

              <!-- Contraseña para crear usuario automáticamente -->
              <div *ngIf="!editingBarber">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                  <span class="text-gray-500 text-xs ml-1">(se usará para crear el usuario automáticamente)</span>
                </label>
                <div class="relative">
                  <input [type]="showBarberPassword ? 'text' : 'password'" formControlName="password"
                         class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                         placeholder="Mínimo 6 caracteres"
                         autocomplete="new-password"
                         spellcheck="false">
                  <button type="button" (click)="toggleShowBarberPassword()" class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-colors">
                    <svg *ngIf="!showBarberPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg *ngIf="showBarberPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 5l4.172-4.172M4.879 4.879l14.242 14.242"/>
                    </svg>
                  </button>
                </div>
                <div *ngIf="barberForm.get('password')?.invalid && barberForm.get('password')?.touched" class="text-red-500 text-sm mt-1">
                  <span *ngIf="barberForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
                  <span *ngIf="barberForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres</span>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" (click)="closeBarberModalModified()" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" [disabled]="barberForm.invalid" class="btn-primary" [class.opacity-50]="barberForm.invalid">
                {{ editingBarber ? 'Actualizar Barbero' : 'Crear Barbero' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para Crear Servicio -->
      <div *ngIf="showServiceModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/40 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gradient-to-r from-blue-100 to-indigo-100">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio' }}</h2>
            <button (click)="closeServiceModalModified()" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-110 shadow-md">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form [formGroup]="serviceForm" (ngSubmit)="onSubmitServiceModified()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del servicio</label>
                <input type="text" formControlName="name" class="input-field" placeholder="Ej: Corte + Barba">
                <div *ngIf="serviceForm.get('name')?.invalid && serviceForm.get('name')?.touched" class="text-red-500 text-sm mt-1">
                  El nombre es requerido
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio (\$)</label>
                <input type="number" formControlName="price" class="input-field" placeholder="25.00" step="0.01">
                <div *ngIf="serviceForm.get('price')?.invalid && serviceForm.get('price')?.touched" class="text-red-500 text-sm mt-1">
                  El precio es requerido
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                <input type="number" formControlName="duration" class="input-field" placeholder="60">
                <div *ngIf="serviceForm.get('duration')?.invalid && serviceForm.get('duration')?.touched" class="text-red-500 text-sm mt-1">
                  La duración es requerida
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select formControlName="category" class="input-field">
                  <option value="HAIRCUT">Corte de Cabello</option>
                  <option value="BEARD">Barba</option>
                  <option value="STYLING">Peinado</option>
                  <option value="TREATMENT">Tratamiento</option>
                </select>
                <div *ngIf="serviceForm.get('category')?.invalid && serviceForm.get('category')?.touched" class="text-red-500 text-sm mt-1">
                  La categoría es requerida
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imagen del servicio</label>
                <input type="file" (change)="onImageSelect($event)" accept="image/*" class="input-field">
                <div *ngIf="serviceForm.get('image')?.value" class="mt-2">
                  <img [src]="serviceForm.get('image')?.value" alt="Preview" class="w-full h-32 object-cover rounded">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea formControlName="description" class="input-field" rows="3" placeholder="Descripción del servicio..."></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" (click)="closeServiceModalModified()" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" [disabled]="serviceForm.invalid" class="btn-primary" [class.opacity-50]="serviceForm.invalid">
                {{ editingService ? 'Actualizar Servicio' : 'Crear Servicio' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Perfil de Barbero -->
      <div *ngIf="showBarberProfileModal && selectedBarber" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/40 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gradient-to-r from-indigo-100 to-purple-100">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Perfil del Barbero</h2>
            <button (click)="closeBarberProfile()" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-110 shadow-md">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="text-center mb-6">
            <img [src]="selectedBarber.avatar" [alt]="selectedBarber.name" class="w-24 h-24 rounded-full mx-auto mb-4">
            <h3 class="text-xl font-bold text-gray-900">{{ selectedBarber.name }}</h3>
            <p class="text-gray-600">{{ selectedBarber.experience }} años de experiencia</p>
            <div class="flex items-center justify-center mt-2">
              <svg class="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-gray-700 font-medium">{{ selectedBarber.rating }}</span>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-2">Especialidades</h4>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let specialty of selectedBarber.specialties"
                    class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {{ specialty }}
              </span>
            </div>
          </div>

          <div class="mb-6" *ngIf="selectedBarber.description">
            <h4 class="font-semibold text-gray-900 mb-2">Acerca de</h4>
            <p class="text-gray-600">{{ selectedBarber.description }}</p>
          </div>

          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-3">Horarios Disponibles Hoy</h4>
            <div class="grid grid-cols-3 gap-2">
              <button *ngFor="let time of availableTimeSlots.slice(0, 9)"
                      class="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300"
                      (click)="bookAppointmentWithBarber(selectedBarber.id)">
                {{ time }}
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button (click)="closeBarberProfile()" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cerrar
            </button>
            <button (click)="bookAppointmentWithBarber(selectedBarber.id)" class="btn-primary">
              Reservar Cita
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para Agendar Cita -->
      <div *ngIf="showAppointmentModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/40 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gradient-to-r from-purple-100 to-pink-100">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Agendar Nueva Cita</h2>
            <button (click)="closeAppointmentModal()" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-110 shadow-md">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form [formGroup]="appointmentForm" (ngSubmit)="onSubmitAppointment()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Seleccionar Barbero</label>
                <select formControlName="barberId" class="input-field">
                  <option value="">Elige un barbero</option>
                  <option *ngFor="let barber of barbers" [value]="barber.id">{{ barber.name }}</option>
                </select>
                <div *ngIf="appointmentForm.get('barberId')?.invalid && appointmentForm.get('barberId')?.touched" class="text-red-500 text-sm mt-1">
                  Selecciona un barbero
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Seleccionar Servicio</label>
                <select formControlName="serviceId" class="input-field">
                  <option value="">Elige un servicio</option>
                  <option *ngFor="let service of services" [value]="service.id">
                    {{ service.name }} - \${{ service.price }} ({{ service.duration }}min)
                  </option>
                </select>
                <div *ngIf="appointmentForm.get('serviceId')?.invalid && appointmentForm.get('serviceId')?.touched" class="text-red-500 text-sm mt-1">
                  Selecciona un servicio
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" formControlName="date" class="input-field" [min]="minDate">
                <div *ngIf="appointmentForm.get('date')?.invalid && appointmentForm.get('date')?.touched" class="text-red-500 text-sm mt-1">
                  Selecciona una fecha
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <select formControlName="time" class="input-field">
                  <option value="">Selecciona una hora</option>
                  <option *ngFor="let time of availableTimeSlots" [value]="time">{{ time }}</option>
                </select>
                <div *ngIf="appointmentForm.get('time')?.invalid && appointmentForm.get('time')?.touched" class="text-red-500 text-sm mt-1">
                  Selecciona una hora
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" (click)="closeAppointmentModal()" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" [disabled]="appointmentForm.invalid" class="btn-primary" [class.opacity-50]="appointmentForm.invalid">
                Agendar Cita
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para Ver Detalles del Barbero -->
      <div *ngIf="showBarberDetailsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/40 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gradient-to-r from-blue-100 to-indigo-100">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Detalles del Barbero</h2>
            <button (click)="closeBarberDetailsModal()" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-110 shadow-md">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div *ngIf="selectedBarberDetails" class="space-y-6">
            <!-- Información principal del barbero -->
            <div class="flex items-center space-x-6">
              <img [src]="selectedBarberDetails.avatar" [alt]="selectedBarberDetails.name"
                   class="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg">
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedBarberDetails.name }}</h3>
                <div class="space-y-1">
                  <div class="flex items-center text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    {{ selectedBarberDetails.email }}
                  </div>
                  <div class="flex items-center text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    {{ selectedBarberDetails.phone }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Información profesional en cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ selectedBarberDetails.experience }}</div>
                <div class="text-sm text-blue-700">Años de experiencia</div>
              </div>

              <div class="bg-yellow-50 rounded-lg p-4 text-center">
                <div class="flex items-center justify-center mb-1">
                  <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="ml-1 text-xl font-bold text-yellow-600">{{ selectedBarberDetails.rating }}</span>
                </div>
                <div class="text-sm text-yellow-700">Rating promedio</div>
              </div>

              <div class="bg-purple-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">{{ selectedBarberDetails.specialties.length || 0 }}</div>
                <div class="text-sm text-purple-700">Especialidades</div>
              </div>

              <div [class]="selectedBarberDetails.isActive ? 'bg-green-50' : 'bg-red-50'" class="rounded-lg p-4 text-center">
                <div [class]="selectedBarberDetails.isActive ? 'text-green-600' : 'text-red-600'" class="text-lg font-bold">
                  {{ selectedBarberDetails.isActive ? 'ACTIVO' : 'INACTIVO' }}
                </div>
                <div [class]="selectedBarberDetails.isActive ? 'text-green-700' : 'text-red-700'" class="text-sm">Estado actual</div>
              </div>
            </div>

            <!-- Especialidades detalladas -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Especialidades</h4>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let specialty of selectedBarberDetails.specialties"
                      class="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full shadow-sm">
                  {{ specialty }}
                </span>
              </div>
            </div>

            <!-- Descripción -->
            <div *ngIf="selectedBarberDetails.description">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Descripción</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-700 leading-relaxed">{{ selectedBarberDetails.description }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button (click)="closeBarberDetailsModal()"
                    class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para Crear/Editar Usuario -->
      <div *ngIf="showUserModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/40 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gradient-to-r from-green-100 to-emerald-100">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{{ editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h2>
            <button (click)="closeUserModal()" class="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-110 shadow-md">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form [formGroup]="userForm" (ngSubmit)="onSubmitUser()" autocomplete="off">
            <!-- Nombre -->
            <div class="mb-4">
              <label for="userName" class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" id="userName" formControlName="name"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Ingresa el nombre completo"
                     autocomplete="off"
                     spellcheck="false">
              <div *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched" class="text-red-600 text-sm mt-1">
                El nombre es requerido
              </div>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label for="userEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="userEmail" formControlName="email"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="ejemplo@correo.com"
                     autocomplete="new-email"
                     spellcheck="false">
              <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched" class="text-red-600 text-sm mt-1">
                <span *ngIf="userForm.get('email')?.errors?.['required']">El email es requerido</span>
                <span *ngIf="userForm.get('email')?.errors?.['email']">Formato de email inválido</span>
              </div>
            </div>

            <!-- Teléfono -->
            <div class="mb-4">
              <label for="userPhone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" id="userPhone" formControlName="phone"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="+503 7000-0000"
                     autocomplete="off"
                     spellcheck="false">
              <div *ngIf="userForm.get('phone')?.invalid && userForm.get('phone')?.touched" class="text-red-600 text-sm mt-1">
                El teléfono es requerido
              </div>
            </div>

            <!-- Contraseña -->
            <div class="mb-4">
              <label for="userPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
                <span *ngIf="editingUser" class="text-gray-500 text-xs ml-1">(dejar en blanco si no desea cambiarla)</span>
              </label>
              <div class="relative">
                <input [type]="showPassword ? 'text' : 'password'" id="userPassword" formControlName="password"
                       class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       [placeholder]="editingUser ? 'Dejar en blanco para mantener la actual' : 'Mínimo 6 caracteres'"
                       autocomplete="new-password"
                       spellcheck="false">
                <button type="button" (click)="toggleShowPassword()" class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-colors">
                  <svg *ngIf="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 5l4.172-4.172M4.879 4.879l14.242 14.242"/>
                  </svg>
                </button>
              </div>
              <div *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched" class="text-red-600 text-sm mt-1">
                <span *ngIf="userForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
                <span *ngIf="userForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres</span>
              </div>
            </div>

            <!-- Rol -->
            <div class="mb-4">
              <label for="userRole" class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select id="userRole" formControlName="role"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar rol</option>
                <option value="CLIENT">Cliente</option>
                <option value="BARBER">Barbero</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <div *ngIf="userForm.get('role')?.invalid && userForm.get('role')?.touched" class="text-red-600 text-sm mt-1">
                El rol es requerido
              </div>
            </div>

            <!-- Avatar -->
            <div class="mb-4">
              <label for="userAvatar" class="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
              <select id="userAvatar" formControlName="avatar"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=default">Avatar por defecto</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber">Avatar 1</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=MiguelGarcia">Avatar 2</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosLopez">Avatar 3</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=RobertoMartinez">Avatar 4</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber1">Avatar 5</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber2">Avatar 6</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber3">Avatar 7</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber4">Avatar 8</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber5">Avatar 9</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber6">Avatar 10</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber7">Avatar 11</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber8">Avatar 12</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber9">Avatar 13</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber10">Avatar 14</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber11">Avatar 15</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber12">Avatar 16</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber13">Avatar 17</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber14">Avatar 18</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber15">Avatar 19</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber16">Avatar 20</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber17">Avatar 21</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=barber18">Avatar 22</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=DiegoSanchez">Avatar 23</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRodriguez">Avatar 24</option>
                <option value="https://api.dicebear.com/7.x/avataaars/svg?seed=FernandoLopez">Avatar 25</option>
              </select>
              <!-- Vista previa del avatar -->
              <div class="mt-2 flex items-center space-x-2" *ngIf="userForm.get('avatar')?.value">
                <span class="text-sm text-gray-600">Vista previa:</span>
                <img [src]="userForm.get('avatar')?.value" alt="Avatar preview" class="w-8 h-8 rounded-full">
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" (click)="closeUserModal()" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" [disabled]="userForm.invalid" class="btn-primary" [class.opacity-50]="userForm.invalid">
                {{ editingUser ? 'Actualizar' : 'Crear' }} Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      @apply bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6 transition-all duration-300 hover:shadow-xl;
    }

    .btn-primary {
      @apply bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5;
    }

    .input-field {
      @apply w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200;
    }

    .primary-600 {
      @apply text-indigo-600;
    }

    .primary-100 {
      @apply bg-indigo-100;
    }

    /* Estilos para botones de acción */
    .action-btn {
      @apply inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg;
    }

    .view-btn {
      @apply bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-2 border-indigo-200 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300;
    }

    .edit-btn {
      @apply bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-2 border-blue-200 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300;
    }

    .activate-btn {
      @apply bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200 hover:from-green-100 hover:to-emerald-100 hover:border-green-300;
    }

    .deactivate-btn {
      @apply bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-2 border-orange-200 hover:from-orange-100 hover:to-red-100 hover:border-orange-300;
    }

    .delete-btn {
      @apply bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-2 border-red-300 hover:from-red-200 hover:to-pink-200 hover:border-red-400;
    }

    .primary-500 {
      @apply bg-indigo-500;
    }

    .tab-content {
      @apply min-h-[400px] p-6;
    }

    /* Pagination styles */
    .pagination-button {
      @apply px-4 py-2 text-sm font-medium border-2 border-indigo-200 rounded-xl transition-all duration-200 hover:shadow-md bg-white;
    }

    .pagination-button:hover:not(.disabled) {
      @apply bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 transform scale-105;
    }

    .pagination-button.active {
      @apply bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg transform scale-105;
    }

    .pagination-button.disabled {
      @apply opacity-40 cursor-not-allowed hover:scale-100;
    }
  `]
})
export class DashboardComponent implements OnInit {
  // Hacer ServiceCategory disponible en el template
  ServiceCategory = ServiceCategory;
  currentUser: User | null = null;
  services: Service[] = [];
  barbers: Barber[] = [];
  users: any[] = [];
  totalServices = 0;
  totalBarbers = 0;
  totalUsers = 0;

  // Edit states
  editingBarber: Barber | null = null;
  editingService: Service | null = null;
  editingUser: any | null = null;
  showPassword: boolean = false;
  showBarberPassword: boolean = false;

  // Tab system
  activeTab: string = 'barberos';
  tabs = [
    { id: 'barberos', name: 'Barberos', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'servicios', name: 'Servicios', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'horarios', name: 'Horarios', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'usuarios', name: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { id: 'citas', name: 'Citas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
  ];

  // Barber tabs
  activeBarberTab: string = 'mis-citas';
  barberTabs = [
    { id: 'mis-citas', name: 'Mis Citas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'mis-horarios', name: 'Mis Horarios', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'mi-perfil', name: 'Mi Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  // Pagination
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  // Barberos pagination
  barberCurrentPage = 1;
  barberTotalPages = 1;
  paginatedBarbers: Barber[] = [];

  // Servicios pagination
  serviceCurrentPage = 1;
  serviceTotalPages = 1;
  paginatedServices: Service[] = [];

  // Users pagination
  userCurrentPage = 1;
  userTotalPages = 1;
  paginatedUsers: any[] = [];

  // Aliases for template consistency
  get currentUserPage() { return this.userCurrentPage; }
  set currentUserPage(value: number) { this.userCurrentPage = value; }
  get usersPerPage() { return this.pageSize; }

  // Schedule Management
  selectedBarberForSchedule: number | null = null;
  barberSchedules: any[] = [];
  barberExceptions: any[] = [];
  scheduleViewMode: 'calendar' | 'weekly' = 'calendar';
  weekDays = [
    { value: 0, name: 'Domingo', shortName: 'Dom' },
    { value: 1, name: 'Lunes', shortName: 'Lun' },
    { value: 2, name: 'Martes', shortName: 'Mar' },
    { value: 3, name: 'Miércoles', shortName: 'Mié' },
    { value: 4, name: 'Jueves', shortName: 'Jue' },
    { value: 5, name: 'Viernes', shortName: 'Vie' },
    { value: 6, name: 'Sábado', shortName: 'Sáb' }
  ];

  // FullCalendar options
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [],
    height: 'auto',
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      list: 'Lista'
    }
  };

  // Math helpers for templates
  Math = Math;

  // Citas pagination (para futura implementación)
  appointmentCurrentPage = 1;
  appointmentTotalPages = 1;
  appointments: any[] = [];
  paginatedAppointments: any[] = [];

  // Admin stats
  monthlyRevenue = 3250;
  totalAppointments = 127;

  // Barber stats
  myAppointmentsToday = 8;
  myDailyEarnings = 180;
  myClients = 23;

  // Client stats
  myTotalVisits = 12;
  myUpcomingAppointments = 2;
  myFavoriteBarber = 'Miguel';

  // Modal states
  showBarberModal = false;
  showServiceModal = false;
  showUserModal = false;
  showAppointmentModal = false;
  showBarberProfileModal = false;
  showBarberDetailsModal = false;
  selectedBarber: Barber | null = null;
  selectedBarberDetails: Barber | null = null;
  availableTimeSlots: string[] = [];
  minDate: string = new Date().toISOString().split('T')[0];

  // Forms
  barberForm: FormGroup;
  serviceForm: FormGroup;
  userForm: FormGroup;
  appointmentForm: FormGroup;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize forms
    this.barberForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      specialties: [''],
      description: [''],
      avatar: ['https://api.dicebear.com/7.x/avataaars/svg?seed=default']
    });

    this.serviceForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      category: [ServiceCategory.HAIRCUT, [Validators.required]],
      description: [''],
      image: ['']
    });

    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      avatar: ['https://api.dicebear.com/7.x/avataaars/svg?seed=default']
    });

    this.appointmentForm = this.fb.group({
      barberId: ['', [Validators.required]],
      serviceId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Si no hay usuario autenticado, redirigir al login
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.dataService.getServices().subscribe(services => {
      this.services = services;
      this.totalServices = services.length;
      this.updateServicePagination();
    });

    this.dataService.getBarbers().subscribe(barbers => {
      this.barbers = barbers;
      this.totalBarbers = barbers.length;
      this.updateBarberPagination();
    });

    this.dataService.getUsers().subscribe(users => {
      this.users = users;
      this.totalUsers = users.length;
      this.updateUserPagination();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Modal methods
  openBarberModal(): void {
    // Solo limpiar estado si no estamos editando
    if (!this.editingBarber) {
      this.barberForm.reset();
    }
    this.showBarberModal = true;
  }

  createNewBarber(): void {
    this.editingBarber = null; // Limpiar estado de edición
    this.barberForm.reset(); // Resetear formulario
    this.showBarberModal = true;
  }

  createNewUser(): void {
    this.editingUser = null; // Limpiar estado de edición

    // Limpiar formulario de manera más agresiva
    this.userForm.reset();
    this.userForm.markAsUntouched();
    this.userForm.markAsPristine();

    // Establecer explícitamente todos los campos como vacíos excepto avatar
    this.userForm.setValue({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
    });

    this.showUserModal = true;
  }

  closeBarberModal(): void {
    this.closeBarberModalModified();
  }

  openServiceModal(service?: Service): void {
    this.editingService = service || null;
    this.showServiceModal = true;

    if (service) {
      // Editing existing service
      this.serviceForm.patchValue({
        name: service.name,
        price: service.price,
        duration: service.duration,
        category: service.category,
        description: service.description || '',
        image: service.image || ''
      });
    } else {
      // Creating new service
      this.serviceForm.reset({
        category: ServiceCategory.HAIRCUT
      });
    }
  }

  closeServiceModal(): void {
    this.closeServiceModalModified();
  }

  openUserManagement(): void {
    this.activeTab = 'usuarios';
    // Abrir el modal de crear usuario directamente
    this.createNewUser();
  }

  openUserModal(user?: any): void {
    this.editingUser = user || null;
    this.showUserModal = true;

    if (user) {
      // Editing existing user - password is not required
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();

      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        password: ''
      });
    } else {
      // Creating new user - password is required
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();

      this.userForm.reset();
      this.userForm.markAsUntouched();
      this.userForm.markAsPristine();

      // Establecer explícitamente todos los campos como vacíos excepto avatar
      this.userForm.setValue({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
      });
    }
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.editingUser = null;
    this.showPassword = false;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleUserStatus(userId: number, activate: boolean): void {
    const action = activate ? 'activar' : 'desactivar';
    if (confirm(`¿Estás seguro de que quieres ${action} este usuario?`)) {
      this.dataService.toggleUserStatus(userId, activate).subscribe({
        next: () => {
          alert(`Usuario ${action}do exitosamente!`);
          this.loadUsers(); // Reload users to reflect changes
        },
        error: (error) => {
          console.error(`Error ${action}ndo usuario:`, error);
          alert(`Error al ${action} usuario: ` + (error.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  deleteUser(user: any): void {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
      this.dataService.deleteUser(user.id).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente!');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Error al eliminar usuario: ' + (error.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  onSubmitUser(): void {
    if (this.userForm.valid) {
      const userData: any = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
        role: this.userForm.value.role,
        avatar: this.userForm.value.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
      };

      // Include password if provided (for both create and update)
      if (this.userForm.value.password && this.userForm.value.password.trim() !== '') {
        userData.password = this.userForm.value.password;
      } else if (!this.editingUser) {
        // For new users, use default password if none provided
        userData.password = 'password123';
      }

      if (this.editingUser) {
        // Update existing user
        this.dataService.updateUser(this.editingUser.id, userData).subscribe({
          next: (updatedUser) => {
            alert('Usuario actualizado exitosamente!');
            this.closeUserModal();
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error updating user:', error);
            alert('Error al actualizar usuario: ' + (error.error?.message || 'Error desconocido'));
          }
        });
      } else {
        // Create new user
        this.dataService.createUser(userData).subscribe({
          next: (newUser) => {
            alert('Usuario creado exitosamente!');
            this.closeUserModal();
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error creating user:', error);
            alert('Error al crear usuario: ' + (error.error?.message || 'Error desconocido'));
          }
        });
      }
    }
  }

  openAppointmentModal(): void {
    this.showAppointmentModal = true;
    this.appointmentForm.reset();
    this.generateTimeSlots();
  }

  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
  }

  openBarberProfile(barber: Barber): void {
    this.selectedBarber = barber;
    this.showBarberProfileModal = true;
    this.generateTimeSlots();
  }

  closeBarberProfile(): void {
    this.showBarberProfileModal = false;
    this.selectedBarber = null;
  }

  // Form submissions
  onSubmitBarber(): void {
    this.onSubmitBarberModified();
  }

  onSubmitService(): void {
    this.onSubmitServiceModified();
  }

  onSubmitAppointment(): void {
    if (this.appointmentForm.valid) {
      const appointment = {
        barberId: this.appointmentForm.value.barberId,
        serviceId: this.appointmentForm.value.serviceId,
        date: this.appointmentForm.value.date,
        time: this.appointmentForm.value.time,
        clientId: this.currentUser?.id
      };

      this.closeAppointmentModal();
      alert('Cita agendada exitosamente!');
    }
  }

  // Helper methods
  generateTimeSlots(): void {
    this.availableTimeSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño de archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB.');
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      // Mostrar preview local mientras se sube
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.serviceForm.patchValue({ image: e.target.result });
      };
      reader.readAsDataURL(file);

      // Subir a Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      this.dataService.uploadServiceImage(formData).subscribe({
        next: (response) => {
          this.serviceForm.patchValue({ image: response.url });
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          alert('Error al subir la imagen: ' + (error.error?.error || 'Error desconocido'));
        }
      });
    }
  }

  bookAppointmentWithBarber(barberId: number): void {
    this.appointmentForm.patchValue({ barberId: barberId });
    this.closeBarberProfile();
    this.openAppointmentModal();
  }

  // === FUNCIONES PARA GESTIÓN DE BARBEROS ===
  editBarber(barber: Barber): void {
    this.editingBarber = barber;

    // Prellenar el formulario con los datos del barbero
    this.barberForm.patchValue({
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      experience: barber.experience,
      specialties: barber.specialties.join(', '),
      description: barber.description || '',
      avatar: barber.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
    });

    this.openBarberModal();
  }

  toggleBarberStatus(barber: Barber): void {
    const action = barber.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que quieres ${action} a ${barber.name}?`)) {
      // Aquí harías la llamada al backend para cambiar el estado
      barber.isActive = !barber.isActive;
      alert(`Barbero ${action}do exitosamente`);
    }
  }

  deleteBarber(barber: Barber): void {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${barber.name}? Esta acción no se puede deshacer.`)) {
      this.dataService.deleteBarber(barber.id).subscribe({
        next: () => {
          alert('Barbero eliminado exitosamente!');
          this.loadData();
        },
        error: (error) => {
          console.error('Error deleting barber:', error);
          alert('Error al eliminar barbero: ' + (error.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  viewBarberDetails(barber: Barber): void {
    this.selectedBarberDetails = barber;
    this.showBarberDetailsModal = true;
  }

  // === FUNCIONES PARA GESTIÓN DE SERVICIOS ===
  editService(service: Service): void {
    this.openServiceModal(service);
  }

  toggleServiceStatus(service: Service): void {
    const action = service.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que quieres ${action} el servicio "${service.name}"?`)) {
      const serviceAction = service.isActive
        ? this.dataService.deactivateService(service.id)
        : this.dataService.activateService(service.id);

      serviceAction.subscribe({
        next: () => {
          alert(`Servicio ${action}do exitosamente`);
          this.loadData(); // Recargar datos para reflejar el cambio
        },
        error: (error) => {
          console.error(`Error ${action}ndo servicio:`, error);
          alert(`Error al ${action} servicio: ` + (error.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  deleteService(service: Service): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el servicio "${service.name}"? Esta acción no se puede deshacer.`)) {
      this.dataService.deleteService(service.id).subscribe({
        next: () => {
          alert('Servicio eliminado exitosamente!');
          this.loadData();
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          alert('Error al eliminar servicio: ' + (error.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  // === FUNCIONES AUXILIARES PARA LA VISTA ===
  getCategoryDisplayName(category: ServiceCategory): string {
    const categoryNames: { [key in ServiceCategory]: string } = {
      [ServiceCategory.HAIRCUT]: 'Corte de Cabello',
      [ServiceCategory.BEARD]: 'Barba',
      [ServiceCategory.STYLING]: 'Peinado',
      [ServiceCategory.TREATMENT]: 'Tratamiento'
    };
    return categoryNames[category] || 'Otro';
  }

  getCategoryBadgeClass(category: ServiceCategory): string {
    const categoryClasses: { [key in ServiceCategory]: string } = {
      [ServiceCategory.HAIRCUT]: 'px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full',
      [ServiceCategory.BEARD]: 'px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full',
      [ServiceCategory.STYLING]: 'px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full',
      [ServiceCategory.TREATMENT]: 'px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'
    };
    return categoryClasses[category] || 'px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full';
  }

  // === MODIFICAR FUNCIONES DE SUBMIT PARA EDICIÓN ===
  onSubmitBarberModified(): void {
    if (this.barberForm.valid) {
      const barberData = {
        name: this.barberForm.value.name,
        email: this.barberForm.value.email,
        phone: this.barberForm.value.phone,
        password: this.editingBarber ? undefined : 'password123', // Solo para crear
        experience: this.barberForm.value.experience,
        specialties: this.barberForm.value.specialties?.split(',').map((s: string) => s.trim()) || [],
        description: this.barberForm.value.description || '',
        avatar: this.barberForm.value.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
      };

      if (this.editingBarber) {
        // Editar barbero existente
        this.dataService.updateBarber(this.editingBarber.id, barberData).subscribe({
          next: (updatedBarber) => {
            alert('Barbero actualizado exitosamente!');
            this.closeBarberModal();
            this.loadData();
          },
          error: (error) => {
            console.error('Error updating barber:', error);
            alert('Error al actualizar barbero: ' + (error.error?.message || 'Error desconocido'));
          }
        });
      } else {
        // Crear nuevo barbero
        this.dataService.createBarber(barberData).subscribe({
          next: (newBarber) => {
            alert('Barbero creado exitosamente!');
            this.closeBarberModal();
            this.loadData();
          },
          error: (error) => {
            console.error('Error creating barber:', error);
            alert('Error al crear barbero: ' + (error.error?.message || 'Error desconocido'));
          }
        });
      }
    }
  }

  onSubmitServiceModified(): void {
    if (this.serviceForm.valid) {
      const serviceData = {
        name: this.serviceForm.value.name,
        description: this.serviceForm.value.description || '',
        price: parseFloat(this.serviceForm.value.price),
        duration: parseInt(this.serviceForm.value.duration),
        category: this.serviceForm.value.category,
        image: this.serviceForm.value.image || '/assets/images/services/default.svg'
      };

      if (this.editingService) {
        // Editar servicio existente
        this.dataService.updateService(this.editingService.id, serviceData).subscribe({
          next: (updatedService) => {
            alert('Servicio actualizado exitosamente!');
            this.closeServiceModal();
            this.loadData();
          },
          error: (error) => {
            console.error('Error updating service:', error);
            alert('Error al actualizar servicio: ' + (error.error?.message || 'Error desconocido'));
          }
        });
      } else {
        // Crear nuevo servicio
        this.dataService.createService(serviceData).subscribe({
          next: (newService) => {
            alert('Servicio creado exitosamente!');
            this.closeServiceModal();
            this.loadData();
          },
          error: (error) => {
            console.error('Error creating service:', error);
            alert('Error al crear servicio: ' + (error.error?.message || 'Error desconocido'));
          }
        });
      }
    }
  }

  // === MODIFICAR LAS FUNCIONES DE CERRAR MODAL ===
  closeBarberModalModified(): void {
    this.showBarberModal = false;
    this.editingBarber = null; // Limpiar estado de edición
    this.showBarberPassword = false;
  }

  toggleShowBarberPassword(): void {
    this.showBarberPassword = !this.showBarberPassword;
  }

  closeServiceModalModified(): void {
    this.showServiceModal = false;
    this.editingService = null; // Limpiar estado de edición
  }

  closeBarberDetailsModal(): void {
    this.showBarberDetailsModal = false;
    this.selectedBarberDetails = null;
  }

  // === FUNCIONES DE PESTAÑAS ===
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    if (tabId === 'usuarios') {
      this.loadUsers();
    }
  }

  // === FUNCIONES DE PAGINACIÓN ===
  updateBarberPagination(): void {
    this.barberTotalPages = Math.ceil(this.barbers.length / this.pageSize);
    this.barberCurrentPage = Math.min(this.barberCurrentPage, this.barberTotalPages || 1);

    const startIndex = (this.barberCurrentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBarbers = this.barbers.slice(startIndex, endIndex);
  }

  updateServicePagination(): void {
    this.serviceTotalPages = Math.ceil(this.services.length / this.pageSize);
    this.serviceCurrentPage = Math.min(this.serviceCurrentPage, this.serviceTotalPages || 1);

    const startIndex = (this.serviceCurrentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedServices = this.services.slice(startIndex, endIndex);
  }

  updateUserPagination(): void {
    this.userTotalPages = Math.ceil(this.users.length / this.pageSize);
    this.userCurrentPage = Math.min(this.userCurrentPage, this.userTotalPages || 1);

    const startIndex = (this.userCurrentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  // Funciones de navegación de páginas para barberos
  goToBarberPage(page: number): void {
    if (page >= 1 && page <= this.barberTotalPages) {
      this.barberCurrentPage = page;
      this.updateBarberPagination();
    }
  }

  previousBarberPage(): void {
    this.goToBarberPage(this.barberCurrentPage - 1);
  }

  nextBarberPage(): void {
    this.goToBarberPage(this.barberCurrentPage + 1);
  }

  // Funciones de navegación de páginas para servicios
  goToServicePage(page: number): void {
    if (page >= 1 && page <= this.serviceTotalPages) {
      this.serviceCurrentPage = page;
      this.updateServicePagination();
    }
  }

  previousServicePage(): void {
    this.goToServicePage(this.serviceCurrentPage - 1);
  }

  nextServicePage(): void {
    this.goToServicePage(this.serviceCurrentPage + 1);
  }

  // Funciones de navegación de páginas para usuarios
  goToUserPage(page: number): void {
    if (page >= 1 && page <= this.userTotalPages) {
      this.userCurrentPage = page;
      this.updateUserPagination();
    }
  }

  previousUserPage(): void {
    this.goToUserPage(this.userCurrentPage - 1);
  }

  nextUserPage(): void {
    this.goToUserPage(this.userCurrentPage + 1);
  }

  // Handle page size change from select element
  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = +target.value;
    this.changePageSize(newSize);
  }

  // Cambiar tamaño de página
  changePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.barberCurrentPage = 1;
    this.serviceCurrentPage = 1;
    this.appointmentCurrentPage = 1;

    this.updateBarberPagination();
    this.updateServicePagination();
  }

  // Generar array de números de página para mostrar
  getPageNumbers(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let end = Math.min(totalPages, start + maxPagesToShow - 1);

      if (end - start < maxPagesToShow - 1) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  // Información de la paginación actual
  getBarberPaginationInfo(): string {
    const start = (this.barberCurrentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.barberCurrentPage * this.pageSize, this.barbers.length);
    return `Mostrando ${start} - ${end} de ${this.barbers.length} barberos`;
  }

  getServicePaginationInfo(): string {
    const start = (this.serviceCurrentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.serviceCurrentPage * this.pageSize, this.services.length);
    return `Mostrando ${start} - ${end} de ${this.services.length} servicios`;
  }

  getUserPaginationInfo(): string {
    const start = (this.userCurrentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.userCurrentPage * this.pageSize, this.totalUsers);
    return `Mostrando ${start} - ${end} de ${this.totalUsers} usuarios`;
  }

  loadUsers(): void {
    this.dataService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalUsers = users.length;
        this.updateUserPagination();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  // ==================== SCHEDULE MANAGEMENT FUNCTIONS ====================

  loadBarberScheduleData(): void {
    if (!this.selectedBarberForSchedule) {
      this.barberSchedules = [];
      this.barberExceptions = [];
      return;
    }

    // Cargar horarios semanales
    this.dataService.getBarberSchedule(this.selectedBarberForSchedule).subscribe({
      next: (schedules) => {
        this.barberSchedules = schedules;
      },
      error: (error) => {
        console.error('Error loading barber schedules:', error);
        alert('Error al cargar horarios del barbero');
      }
    });

    // Cargar excepciones
    this.dataService.getBarberExceptions(this.selectedBarberForSchedule).subscribe({
      next: (exceptions) => {
        this.barberExceptions = exceptions;
        this.updateCalendarEvents();
      },
      error: (error) => {
        console.error('Error loading barber exceptions:', error);
        alert('Error al cargar excepciones del barbero');
      }
    });
  }

  getScheduleForDay(dayOfWeek: number): any {
    return this.barberSchedules.find(s => s.dayOfWeek === dayOfWeek);
  }

  async openWeekScheduleModal(): Promise<void> {
    if (!this.selectedBarberForSchedule) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Selecciona un barbero primero',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Obtener horarios actuales
    const currentSchedules = this.barberSchedules;
    const enabledDays = currentSchedules
      .filter(s => s.isAvailable)
      .map(s => s.dayOfWeek);

    // Obtener horario común (si existe)
    const commonSchedule = currentSchedules.find(s => s.isAvailable);
    const defaultStart = commonSchedule?.startTime || '09:00';
    const defaultEnd = commonSchedule?.endTime || '18:00';

    // Fechas por defecto (hoy + 3 meses)
    const today = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    const defaultDateFrom = today.toISOString().split('T')[0];
    const defaultDateTo = threeMonthsLater.toISOString().split('T')[0];

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const checkboxes = dayNames.map((name, index) => {
      const isChecked = enabledDays.includes(index);
      return `<label style="display: block; margin-bottom: 8px;">
        <input type="checkbox" id="day-${index}" value="${index}" ${isChecked ? 'checked' : ''}> ${name}
      </label>`;
    }).join('');

    const { value: formValues } = await Swal.fire({
      title: 'Configurar horario semanal base',
      html: `
        <div style="text-align: left; padding: 15px;">
          <div style="margin-bottom: 20px; background: #f0f9ff; padding: 12px; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-size: 13px; color: #1e40af;">
              ℹ️ Define el horario base y opcionalmente crea eventos en el calendario para un rango de fechas.
            </p>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px;">
              🕐 Horario de trabajo
            </label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; color: #6b7280; font-size: 12px; margin-bottom: 5px;">Hora inicio</label>
                <input id="swal-input-start" type="time" value="${defaultStart}" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              </div>
              <div>
                <label style="display: block; color: #6b7280; font-size: 12px; margin-bottom: 5px;">Hora fin</label>
                <input id="swal-input-end" type="time" value="${defaultEnd}" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              </div>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 14px;">
              📅 Días de trabajo
            </label>
            <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
              ${checkboxes}
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
              <input type="checkbox" id="create-calendar-events" checked style="margin-right: 8px;">
              <span style="font-weight: 600; color: #374151; font-size: 14px;">📆 Crear eventos en calendario</span>
            </label>
          </div>

          <div id="date-range-section" style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px;">
              📆 Rango de fechas para eventos
            </label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="display: block; color: #6b7280; font-size: 12px; margin-bottom: 5px;">Desde</label>
                <input id="date-from" type="date" value="${defaultDateFrom}" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              </div>
              <div>
                <label style="display: block; color: #6b7280; font-size: 12px; margin-bottom: 5px;">Hasta</label>
                <input id="date-to" type="date" value="${defaultDateTo}" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              </div>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #6b7280;">
              Se crearán eventos en el calendario para todos los días seleccionados en este rango.
            </p>
          </div>
        </div>
      `,
      width: '550px',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      didOpen: () => {
        const createEventsCheckbox = document.getElementById('create-calendar-events') as HTMLInputElement;
        const dateRangeSection = document.getElementById('date-range-section') as HTMLElement;

        createEventsCheckbox?.addEventListener('change', () => {
          dateRangeSection.style.display = createEventsCheckbox.checked ? 'block' : 'none';
        });
      },
      preConfirm: () => {
        const startTime = (document.getElementById('swal-input-start') as HTMLInputElement).value;
        const endTime = (document.getElementById('swal-input-end') as HTMLInputElement).value;
        const createEvents = (document.getElementById('create-calendar-events') as HTMLInputElement).checked;
        const dateFrom = (document.getElementById('date-from') as HTMLInputElement).value;
        const dateTo = (document.getElementById('date-to') as HTMLInputElement).value;
        const selectedDays: number[] = [];

        for (let i = 0; i <= 6; i++) {
          const checkbox = document.getElementById(`day-${i}`) as HTMLInputElement;
          if (checkbox && checkbox.checked) {
            selectedDays.push(i);
          }
        }

        if (!startTime || !endTime) {
          Swal.showValidationMessage('Por favor ingresa horarios válidos');
          return false;
        }

        if (selectedDays.length === 0) {
          Swal.showValidationMessage('Selecciona al menos un día');
          return false;
        }

        if (createEvents && (!dateFrom || !dateTo)) {
          Swal.showValidationMessage('Por favor selecciona el rango de fechas');
          return false;
        }

        return { startTime, endTime, selectedDays, createEvents, dateFrom, dateTo };
      }
    });

    if (formValues) {
      // 1. Actualizar horario semanal base
      const schedules = formValues.selectedDays.map((day: number) => ({
        dayOfWeek: day,
        startTime: formValues.startTime,
        endTime: formValues.endTime,
        isAvailable: true
      }));

      this.dataService.updateFullWeekSchedule(this.selectedBarberForSchedule, schedules).subscribe({
        next: async () => {
          // 2. Si se solicitó, crear eventos en el calendario
          if (formValues.createEvents) {
            await this.createCalendarEventsForSchedule(
              formValues.selectedDays,
              formValues.dateFrom,
              formValues.dateTo,
              formValues.startTime,
              formValues.endTime
            );
          } else {
            await Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Horario semanal actualizado exitosamente',
              confirmButtonColor: '#3b82f6',
              timer: 2000
            });
            this.loadBarberScheduleData();
          }
        },
        error: (error) => {
          console.error('Error updating week schedule:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar horario semanal: ' + (error.error?.message || 'Error desconocido'),
            confirmButtonColor: '#3b82f6'
          });
        }
      });
    }
  }

  async createCalendarEventsForSchedule(
    selectedDays: number[],
    dateFrom: string,
    dateTo: string,
    startTime: string,
    endTime: string
  ): Promise<void> {
    const exceptions: any[] = [];
    const start = new Date(dateFrom + 'T00:00:00');
    const end = new Date(dateTo + 'T00:00:00');
    let current = new Date(start);

    while (current <= end) {
      if (selectedDays.includes(current.getDay())) {
        const dateStr = current.toISOString().split('T')[0];
        exceptions.push({
          barberProfileId: this.selectedBarberForSchedule,
          exceptionDate: dateStr,
          startTime: startTime,
          endTime: endTime,
          isAvailable: true,
          reason: 'Día de trabajo',
          allDay: false
        });
      }
      current.setDate(current.getDate() + 1);
    }

    if (exceptions.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'No se encontraron fechas que coincidan en el rango seleccionado',
        confirmButtonColor: '#3b82f6'
      });
      this.loadBarberScheduleData();
      return;
    }

    // Show loading
    Swal.fire({
      title: 'Creando eventos...',
      text: `Generando ${exceptions.length} eventos en el calendario`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    let successCount = 0;
    let errorCount = 0;

    for (const exception of exceptions) {
      try {
        await this.dataService.createBarberException(exception).toPromise();
        successCount++;
      } catch (error) {
        errorCount++;
        console.error('Error creating exception:', error);
      }
    }

    this.loadBarberScheduleData();

    await Swal.fire({
      icon: errorCount === 0 ? 'success' : 'warning',
      title: errorCount === 0 ? '¡Éxito!' : 'Completado con errores',
      html: `
        <div style="text-align: left;">
          <p><strong>✅ Horario base actualizado</strong></p>
          <p>📅 Eventos creados en calendario: ${successCount}</p>
          ${errorCount > 0 ? `<p>❌ Errores: ${errorCount}</p>` : ''}
        </div>
      `,
      confirmButtonColor: '#3b82f6'
    });
  }

  async openExceptionModal(): Promise<void> {
    if (!this.selectedBarberForSchedule) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Selecciona un barbero primero',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const { value: formValues } = await Swal.fire({
      title: 'Crear excepción de horario',
      html: `
        <div style="text-align: left; padding: 15px;">
          <div style="margin-bottom: 20px; background: #fef3c7; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 13px; color: #92400e;">
              ⚠️ Las excepciones sobrescriben el horario base para fechas específicas.
            </p>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px;">
              📅 Fecha
            </label>
            <input id="swal-exception-date" type="date" value="${today}" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px;">
              📋 Tipo de excepción
            </label>
            <select id="swal-exception-type" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              <option value="unavailable">❌ No disponible (Ausencia/Día libre)</option>
              <option value="special">⭐ Horario especial (Disponible con horario diferente)</option>
            </select>
          </div>

          <div id="time-section" style="margin-bottom: 15px; display: none;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px;">
              🕐 Horario especial
            </label>
            <div style="margin-bottom: 10px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="swal-all-day" style="margin-right: 8px;">
                <span style="color: #374151; font-size: 13px;">Todo el día</span>
              </label>
            </div>
            <div id="time-inputs-exception">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                  <label style="display: block; color: #6b7280; font-size: 12px; margin-bottom: 5px;">Hora inicio</label>
                  <input id="swal-start-time" type="time" value="09:00" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
                </div>
                <div>
                  <label style="display: block; color: #6b7280; font-size: 12px; margin-bottom: 5px;">Hora fin</label>
                  <input id="swal-end-time" type="time" value="18:00" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
                </div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px;">
              📝 Motivo
            </label>
            <input id="swal-reason" type="text" class="swal2-input" placeholder="Ej: Permiso médico, Vacaciones, etc." style="width: 100%; margin: 0; padding: 8px;">
          </div>
        </div>
      `,
      width: '550px',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      didOpen: () => {
        const exceptionType = document.getElementById('swal-exception-type') as HTMLSelectElement;
        const timeSection = document.getElementById('time-section') as HTMLElement;
        const allDayCheckbox = document.getElementById('swal-all-day') as HTMLInputElement;
        const timeInputs = document.getElementById('time-inputs-exception') as HTMLElement;
        const reasonInput = document.getElementById('swal-reason') as HTMLInputElement;

        // Mostrar/ocultar sección de tiempo según tipo
        exceptionType?.addEventListener('change', () => {
          if (exceptionType.value === 'special') {
            timeSection.style.display = 'block';
            reasonInput.value = 'Horario especial';
          } else {
            timeSection.style.display = 'none';
            reasonInput.value = 'Ausencia';
          }
        });

        // Toggle time inputs cuando se marca "todo el día"
        allDayCheckbox?.addEventListener('change', () => {
          timeInputs.style.display = allDayCheckbox.checked ? 'none' : 'block';
        });

        // Set initial reason
        reasonInput.value = 'Ausencia';
      },
      preConfirm: () => {
        const date = (document.getElementById('swal-exception-date') as HTMLInputElement).value;
        const exceptionType = (document.getElementById('swal-exception-type') as HTMLSelectElement).value;
        const allDay = (document.getElementById('swal-all-day') as HTMLInputElement).checked;
        const startTime = (document.getElementById('swal-start-time') as HTMLInputElement).value;
        const endTime = (document.getElementById('swal-end-time') as HTMLInputElement).value;
        const reason = (document.getElementById('swal-reason') as HTMLInputElement).value;

        if (!date) {
          Swal.showValidationMessage('Por favor selecciona una fecha');
          return false;
        }

        if (exceptionType === 'special' && !allDay && (!startTime || !endTime)) {
          Swal.showValidationMessage('Por favor ingresa horarios válidos');
          return false;
        }

        return {
          date,
          exceptionType,
          allDay: exceptionType === 'special' ? allDay : true,
          startTime: exceptionType === 'special' && !allDay ? startTime : undefined,
          endTime: exceptionType === 'special' && !allDay ? endTime : undefined,
          isAvailable: exceptionType === 'special',
          reason: reason || undefined
        };
      }
    });

    if (formValues) {
      const exception = {
        barberProfileId: this.selectedBarberForSchedule,
        exceptionDate: formValues.date,
        startTime: formValues.startTime,
        endTime: formValues.endTime,
        isAvailable: formValues.isAvailable,
        reason: formValues.reason,
        allDay: formValues.allDay
      };

      this.dataService.createBarberException(exception).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Excepción creada exitosamente',
            confirmButtonColor: '#3b82f6',
            timer: 2000
          });
          this.loadBarberScheduleData();
        },
        error: (error) => {
          console.error('Error creating exception:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear excepción: ' + (error.error?.message || 'Error desconocido'),
            confirmButtonColor: '#3b82f6'
          });
        }
      });
    }
  }

  async deleteException(exceptionId: number): Promise<void> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la excepción de horario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.dataService.deleteBarberException(exceptionId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'Excepción eliminada exitosamente',
            confirmButtonColor: '#3b82f6'
          });
          this.loadBarberScheduleData();
        },
        error: (error) => {
          console.error('Error deleting exception:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al eliminar excepción: ' + (error.error?.message || 'Error desconocido'),
            confirmButtonColor: '#3b82f6'
          });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  // ==================== FULLCALENDAR FUNCTIONS ====================

  updateCalendarEvents(): void {
    const events = this.barberExceptions.map(exception => {
      let title = '';
      let backgroundColor = '';
      let borderColor = '';
      let textColor = '#ffffff';
      let icon = '';

      if (exception.isAvailable) {
        // Día de trabajo disponible
        if (exception.reason === 'Día de trabajo') {
          title = '✓ Disponible';
          backgroundColor = '#10b981'; // green-500
          borderColor = '#059669'; // green-600
          icon = '✓';
        } else {
          // Horario especial
          title = exception.reason || '⭐ Horario especial';
          backgroundColor = '#3b82f6'; // blue-500
          borderColor = '#2563eb'; // blue-600
          icon = '⭐';
        }
      } else {
        // No disponible (ausencia, día libre)
        title = exception.reason || '✕ No disponible';
        backgroundColor = '#ef4444'; // red-500
        borderColor = '#dc2626'; // red-600
        textColor = '#ffffff';
        icon = '✕';
      }

      // Agregar horario si no es todo el día
      if (!exception.allDay && exception.startTime && exception.endTime) {
        title = `${icon} ${exception.startTime}-${exception.endTime}`;
      }

      return {
        id: exception.id?.toString(),
        title: title,
        start: exception.exceptionDate,
        allDay: exception.allDay,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        textColor: textColor,
        classNames: ['custom-event'],
        extendedProps: {
          exception: exception,
          icon: icon
        }
      };
    });

    this.calendarOptions.events = events;
  }

  async handleDateSelect(selectInfo: DateSelectArg): Promise<void> {
    if (!this.selectedBarberForSchedule) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Selecciona un barbero primero',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const selectedDate = new Date(selectInfo.startStr + 'T00:00:00');
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayOfWeek = selectedDate.getDay();
    const dayName = dayNames[dayOfWeek];

    const { value: formValues } = await Swal.fire({
      title: `<div style="color: #1f2937; font-size: 20px; font-weight: 600; margin-bottom: 10px;">Configurar ${dayName}</div>`,
      html: `
        <div style="text-align: left; padding: 10px; background: #f9fafb; border-radius: 8px; max-height: 500px; overflow-y: auto;">
          <!-- Tipo de configuración -->
          <div style="margin-bottom: 15px; background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 13px;">
              📅 Tipo de configuración
            </label>
            <select id="config-type" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              <option value="range">Rango de fechas (todos los ${dayName}s)</option>
              <option value="single">Solo este día específico</option>
            </select>
          </div>

          <!-- Rango de fechas -->
          <div id="date-range-section" style="margin-bottom: 15px; background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 13px;">
              📆 Rango de fechas
            </label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div>
                <label style="display: block; color: #6b7280; font-size: 11px; margin-bottom: 4px;">Desde</label>
                <input id="date-from" type="date" value="${selectInfo.startStr}" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              </div>
              <div>
                <label style="display: block; color: #6b7280; font-size: 11px; margin-bottom: 4px;">Hasta</label>
                <input id="date-to" type="date" value="${selectInfo.startStr}" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              </div>
            </div>
          </div>

          <!-- Horario -->
          <div style="margin-bottom: 15px; background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 13px;">
              🕐 Horario de trabajo
            </label>
            <div style="margin-bottom: 8px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="all-day-check" style="margin-right: 8px;">
                <span style="color: #374151; font-size: 13px;">Todo el día libre</span>
              </label>
            </div>
            <div id="time-section">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                  <label style="display: block; color: #6b7280; font-size: 11px; margin-bottom: 4px;">Hora inicio</label>
                  <input id="time-start" type="time" value="09:00" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
                </div>
                <div>
                  <label style="display: block; color: #6b7280; font-size: 11px; margin-bottom: 4px;">Hora fin</label>
                  <input id="time-end" type="time" value="18:00" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
                </div>
              </div>
            </div>
          </div>

          <!-- Estado -->
          <div style="margin-bottom: 15px; background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 13px;">
              ⚡ Estado de disponibilidad
            </label>
            <select id="availability-status" class="swal2-input" style="width: 100%; margin: 0; padding: 8px;">
              <option value="true">✅ Disponible (Día de trabajo)</option>
              <option value="false">❌ No disponible (Día libre/Ausencia)</option>
              <option value="special">⭐ Horario especial</option>
            </select>
          </div>

          <!-- Motivo -->
          <div style="background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 13px;">
              📝 Motivo (opcional)
            </label>
            <input id="reason-input" type="text" class="swal2-input" placeholder="Ej: Vacaciones, Permiso médico, etc." style="width: 100%; margin: 0; padding: 8px;">
          </div>
        </div>
      `,
      width: '650px',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        const configType = document.getElementById('config-type') as HTMLSelectElement;
        const dateRangeSection = document.getElementById('date-range-section') as HTMLElement;
        const allDayCheck = document.getElementById('all-day-check') as HTMLInputElement;
        const timeSection = document.getElementById('time-section') as HTMLElement;
        const availabilityStatus = document.getElementById('availability-status') as HTMLSelectElement;
        const reasonInput = document.getElementById('reason-input') as HTMLInputElement;

        // Toggle date range visibility
        configType?.addEventListener('change', () => {
          dateRangeSection.style.display = configType.value === 'range' ? 'block' : 'none';
        });

        // Toggle time inputs
        allDayCheck?.addEventListener('change', () => {
          timeSection.style.display = allDayCheck.checked ? 'none' : 'block';
        });

        // Auto-fill reason based on status
        availabilityStatus?.addEventListener('change', () => {
          if (availabilityStatus.value === 'false') {
            reasonInput.value = 'Día libre';
          } else if (availabilityStatus.value === 'special') {
            reasonInput.value = 'Horario especial';
          } else {
            reasonInput.value = 'Día de trabajo';
          }
        });
      },
      preConfirm: () => {
        const configType = (document.getElementById('config-type') as HTMLSelectElement).value;
        const dateFrom = (document.getElementById('date-from') as HTMLInputElement).value;
        const dateTo = (document.getElementById('date-to') as HTMLInputElement).value;
        const allDay = (document.getElementById('all-day-check') as HTMLInputElement).checked;
        const timeStart = (document.getElementById('time-start') as HTMLInputElement).value;
        const timeEnd = (document.getElementById('time-end') as HTMLInputElement).value;
        const status = (document.getElementById('availability-status') as HTMLSelectElement).value;
        const reason = (document.getElementById('reason-input') as HTMLInputElement).value;

        if (configType === 'range' && (!dateFrom || !dateTo)) {
          Swal.showValidationMessage('Por favor selecciona el rango de fechas');
          return false;
        }

        if (!allDay && (!timeStart || !timeEnd)) {
          Swal.showValidationMessage('Por favor ingresa horarios válidos');
          return false;
        }

        return {
          configType,
          dateFrom,
          dateTo,
          allDay,
          timeStart: allDay ? undefined : timeStart,
          timeEnd: allDay ? undefined : timeEnd,
          isAvailable: status === 'false' ? false : true,
          reason: reason || undefined
        };
      }
    });

    if (formValues) {
      if (formValues.configType === 'range') {
        // Create exceptions for all matching day-of-week dates in the range
        await this.createRangeExceptions(
          selectInfo.startStr,
          formValues.dateFrom,
          formValues.dateTo,
          dayOfWeek,
          formValues.timeStart,
          formValues.timeEnd,
          formValues.allDay,
          formValues.isAvailable,
          formValues.reason
        );
      } else {
        // Single date exception
        const exception = {
          barberProfileId: this.selectedBarberForSchedule,
          exceptionDate: selectInfo.startStr,
          startTime: formValues.timeStart,
          endTime: formValues.timeEnd,
          isAvailable: formValues.isAvailable,
          reason: formValues.reason,
          allDay: formValues.allDay
        };

        this.dataService.createBarberException(exception).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Configuración guardada exitosamente',
              confirmButtonColor: '#3b82f6',
              timer: 2000
            });
            this.loadBarberScheduleData();
          },
          error: (error) => {
            console.error('Error creating exception:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al guardar: ' + (error.error?.message || 'Error desconocido'),
              confirmButtonColor: '#3b82f6'
            });
          }
        });
      }
    }
  }

  async createRangeExceptions(
    selectedDate: string,
    dateFrom: string,
    dateTo: string,
    targetDayOfWeek: number,
    startTime: string | undefined,
    endTime: string | undefined,
    allDay: boolean,
    isAvailable: boolean,
    reason: string | undefined
  ): Promise<void> {
    const exceptions: any[] = [];
    const start = new Date(dateFrom + 'T00:00:00');
    const end = new Date(dateTo + 'T00:00:00');

    let current = new Date(start);

    while (current <= end) {
      if (current.getDay() === targetDayOfWeek) {
        const dateStr = current.toISOString().split('T')[0];
        exceptions.push({
          barberProfileId: this.selectedBarberForSchedule,
          exceptionDate: dateStr,
          startTime: startTime,
          endTime: endTime,
          isAvailable: isAvailable,
          reason: reason,
          allDay: allDay
        });
      }
      current.setDate(current.getDate() + 1);
    }

    if (exceptions.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'No se encontraron fechas que coincidan en el rango seleccionado',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Show loading
    Swal.fire({
      title: 'Guardando...',
      text: `Creando ${exceptions.length} configuraciones`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    let successCount = 0;
    let errorCount = 0;

    for (const exception of exceptions) {
      try {
        await this.dataService.createBarberException(exception).toPromise();
        successCount++;
      } catch (error) {
        errorCount++;
        console.error('Error creating exception:', error);
      }
    }

    this.loadBarberScheduleData();

    await Swal.fire({
      icon: errorCount === 0 ? 'success' : 'warning',
      title: errorCount === 0 ? '¡Éxito!' : 'Completado con errores',
      html: `
        <div style="text-align: left;">
          <p>✅ Configuraciones creadas: ${successCount}</p>
          ${errorCount > 0 ? `<p>❌ Errores: ${errorCount}</p>` : ''}
        </div>
      `,
      confirmButtonColor: '#3b82f6'
    });
  }

  async handleEventClick(clickInfo: EventClickArg): Promise<void> {
    const exception = clickInfo.event.extendedProps['exception'];

    const details = `
      <div style="text-align: left; padding: 10px;">
        <p><strong>Fecha:</strong> ${this.formatDate(exception.exceptionDate)}</p>
        <p><strong>Tipo:</strong> ${exception.allDay ? 'Todo el día' : `Horario: ${exception.startTime || ''} - ${exception.endTime || ''}`}</p>
        <p><strong>Estado:</strong> ${exception.isAvailable ? '✅ Disponible' : '❌ No disponible'}</p>
        ${exception.reason ? `<p><strong>Motivo:</strong> ${exception.reason}</p>` : ''}
      </div>
    `;

    const result = await Swal.fire({
      title: 'Detalles de la excepción',
      html: details,
      icon: 'info',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      denyButtonColor: '#6b7280',
      cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
      this.deleteException(exception.id);
    }
  }
}