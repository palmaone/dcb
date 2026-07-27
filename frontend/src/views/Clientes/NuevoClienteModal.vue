<template>
  <v-dialog max-width="600" persistent>
     <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="deep-orange-accent-4" 
        icon="mdi-plus"
        text="Open Dialog"
        variant="flat"
      ></v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar title="Agrega un nuevo cliente">
          
          <v-btn
            text="Cerrar"
            @click="isActive.value = false"
          >
            <template #append>
              <v-icon color="red">mdi-close</v-icon>
            </template>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field label="Nombre" placeholder="Nombre de pila"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Apellido"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Domicilio"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Colonia"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Entre calles"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Persona de confianza"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Telefono" type="phone"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="email" type="email"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea label="Notas"></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn>Cancelar</v-btn>
          <v-btn>Guardar</v-btn>
        </v-card-actions>
      </v-card>

    </template>
  </v-dialog>
</template>