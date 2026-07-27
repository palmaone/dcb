<template>
  <v-card title="Datos del cliente">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field label="Nombre" variant="outlined" />
        <v-text-field label="Teléfono" variant="outlined" />
        <v-text-field label="Calle" variant="outlined" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field label="Apellidos" variant="outlined" />
        <v-text-field label="Correo electrónico" variant="outlined" />
        <v-text-field label="Colonia" variant="outlined" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field label="Entre calles" variant="outlined" />
      </v-col>
      <v-col cols="3">
        <v-text-field label="Número exterior" variant="outlined" />
      </v-col>
      <v-col cols="3">
        <v-text-field label="C.P" variant="outlined" />
      </v-col>
    </v-row>
  </v-card>
</template>
