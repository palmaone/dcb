<template>
    <v-card title="Descripción">
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field label="Cantidad" variant="outlined" />
                <v-text-field label="Producto" variant="outlined" />
                <v-text-field label="Precio unitario" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field label="Total" variant="outlined" />
                <v-text-field label="Descuento" variant="outlined" />
                <v-text-field label="Subtotal" variant="outlined" />
            </v-col>
        </v-row>
    </v-card>
</template>