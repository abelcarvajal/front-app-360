<template>
    <footer class="footer">
        <div class="footer-content">
            <!-- <div class="footer-section logo-section">
                <img :src="logoUrl" alt="Logo Fundación" class="footer-logo" />
            </div> -->

            <div class="footer-section">
                <h3>Fundación Camino de la Esperanza</h3>
                <p>Transformando vidas, construyendo esperanza</p>
            </div>

            <div class="footer-section contact">
                <h4>Contacto</h4>
                <div class="contact-info">
                    <span><el-icon><Location /></el-icon> [Tu dirección]</span>
                    <span><el-icon><Phone /></el-icon> [Tu teléfono]</span>
                    <span><el-icon><Message /></el-icon> [Tu email]</span>
                </div>
            </div>

            <div class="footer-section">
                <h4>Síguenos</h4>
                <div class="social-links">
                    <a href="#" target="_blank"><el-icon><Platform /></el-icon> Facebook</a>
                    <a href="#" target="_blank"><el-icon><Platform /></el-icon> Instagram</a>
                    <a href="#" target="_blank"><el-icon><Platform /></el-icon> Twitter</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { Location, Phone, Message, Platform } from '@element-plus/icons-vue'
// import logoUrl from '@/assets/logo.png'
</script>

<style scoped>
.footer {
    background-color: #2c3e50;
    color: #ffffff;
    height: 100%;
    display: flex;
    align-items: center;
}

.footer-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    gap: 1rem;
}

.footer-section {
    flex: 1;
    text-align: center;
    padding: 0 1rem;
    max-width: 300px;
}

.logo-section {
    flex: 0.5; /* Hace que la sección del logo sea más pequeña */
    max-width: 150px;
}

.footer-logo {
    max-height: 80px; /* Ajusta según el tamaño que necesites */
    width: auto;
    object-fit: contain;
}

.footer-section h3 {
    color: #ffffff;
    font-size: 1.1rem;
    margin: 0 0 0.5rem 0;
}

.footer-section h4 {
    color: #ffffff;
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
}

.footer-section p {
    color: #ecf0f1;
    font-size: 0.9rem;
    margin: 0;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.9rem;
}

.contact-info span {
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.social-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.social-links a {
    color: #ecf0f1;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

.social-links a:hover {
    color: #3498db;
}

@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
    }

    .footer-section {
        padding: 0.2rem;
    }

    .social-links {
        flex-direction: row;
    }
}
</style>
