# Guía de Despliegue en AWS EC2 - FinanceBro

Esta guía te ayudará a desplegar la aplicación completa FinanceBro en una instancia EC2 de AWS usando Docker Compose.

## Índice

1. [Arquitectura de Despliegue](#arquitectura-de-despliegue)
2. [Prerequisitos](#prerequisitos)
3. [Paso 1: Crear y Configurar Instancia EC2](#paso-1-crear-y-configurar-instancia-ec2)
4. [Paso 2: Conectar a la Instancia](#paso-2-conectar-a-la-instancia)
5. [Paso 3: Instalar Dependencias](#paso-3-instalar-dependencias)
6. [Paso 4: Configurar el Proyecto](#paso-4-configurar-el-proyecto)
7. [Paso 5: Desplegar con Docker Compose](#paso-5-desplegar-con-docker-compose)
8. [Paso 6: Configurar Dominio y SSL](#paso-6-configurar-dominio-y-ssl)
9. [Paso 7: Configurar Backups](#paso-7-configurar-backups)
10. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
11. [Costos Estimados](#costos-estimados)
12. [Troubleshooting](#troubleshooting)

---

## Arquitectura de Despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS EC2 Instance                         │
│                  (Ubuntu 22.04 LTS)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Docker Compose                         │    │
│  │                                                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │PostgreSQL│  │  Redis   │  │ pgAdmin  │         │    │
│  │  │ :5432    │  │  :6379   │  │ :5050    │         │    │
│  │  └──────┬───┘  └──────┬───┘  └──────────┘         │    │
│  │         │             │                             │    │
│  │         └──────┬──────┘                             │    │
│  │                │                                     │    │
│  │         ┌──────▼────────┐                           │    │
│  │         │    Backend    │                           │    │
│  │         │    NestJS     │                           │    │
│  │         │   :3000       │                           │    │
│  │         └──────┬────────┘                           │    │
│  │                │                                     │    │
│  │         ┌──────▼────────┐                           │    │
│  │         │   Frontend    │                           │    │
│  │         │  React+Nginx  │◄──────────┐              │    │
│  │         │   :80, :443   │           │              │    │
│  │         └───────────────┘           │              │    │
│  └─────────────────────────────────────┼──────────────┘    │
│                                         │                    │
│  ┌──────────────────────────────────────▼─────────────┐    │
│  │          Volumes Persistentes                       │    │
│  │  - postgres_data (Base de datos)                    │    │
│  │  - redis_data (Cache)                               │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Internet
                         │
              ┌──────────▼──────────┐
              │   AWS Security      │
              │   Group Rules       │
              │  - 22 (SSH)         │
              │  - 80 (HTTP)        │
              │  - 443 (HTTPS)      │
              └─────────────────────┘
```

---

## Prerequisitos

### En tu computadora local

- ✅ Cuenta de AWS con acceso a EC2
- ✅ AWS CLI instalado (opcional pero recomendado)
- ✅ Cliente SSH (Terminal en Mac/Linux, PuTTY en Windows)
- ✅ Dominio configurado (opcional, para HTTPS)

### Conocimientos necesarios

- Comandos básicos de Linux
- Conceptos de Docker y Docker Compose
- Configuración básica de AWS

---

## Paso 1: Crear y Configurar Instancia EC2

### 1.1. Crear la Instancia

1. **Ingresa a AWS Console**: https://console.aws.amazon.com/
2. **Ve a EC2**: Services → EC2 → Launch Instance
3. **Configuración**:

   **Nombre y etiquetas**:
   ```
   Name: FinanceBro-Production
   ```

   **Application and OS Images (AMI)**:
   ```
   - Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
   - Arquitectura: 64-bit (x86)
   ```

   **Instance Type**:
   ```
   Para empezar: t3.small o t3.medium
   - t3.small:  2 vCPU, 2 GB RAM (~$15/mes)
   - t3.medium: 2 vCPU, 4 GB RAM (~$30/mes) ✅ RECOMENDADO
   - t3.large:  2 vCPU, 8 GB RAM (~$60/mes) (para producción alta)
   ```

   **Key pair (login)**:
   ```
   - Create new key pair
   - Name: financebro-key
   - Type: RSA
   - Format: .pem (para Mac/Linux) o .ppk (para Windows/PuTTY)
   - Descarga y guarda en lugar seguro
   ```

### 1.2. Configurar Security Group

**Network settings** → **Create security group**:

```
Security Group Name: financebro-sg
Description: Security group para FinanceBro app

Inbound Rules:
┌──────────┬──────────┬────────────┬─────────────────┐
│   Type   │ Protocol │    Port    │     Source      │
├──────────┼──────────┼────────────┼─────────────────┤
│   SSH    │   TCP    │     22     │   My IP (tú)    │
│   HTTP   │   TCP    │     80     │   0.0.0.0/0     │
│   HTTPS  │   TCP    │    443     │   0.0.0.0/0     │
│  Custom  │   TCP    │    3000    │   0.0.0.0/0     │ (opcional, para debugging)
│  Custom  │   TCP    │    5050    │   My IP         │ (opcional, para pgAdmin)
└──────────┴──────────┴────────────┴─────────────────┘
```

**⚠️ IMPORTANTE**:
- SSH (22) solo desde tu IP por seguridad
- HTTP (80) y HTTPS (443) abiertos al mundo
- 3000 y 5050 son opcionales y solo para debugging

### 1.3. Configurar Storage

```
Storage (volumes):
- Root volume: 30 GB gp3 (mínimo)
- Tipo: General Purpose SSD (gp3)

Para producción con muchos datos:
- 50-100 GB recomendado
```

### 1.4. Lanzar Instancia

1. Revisa la configuración
2. Click **"Launch instance"**
3. Espera 2-3 minutos a que la instancia inicie

### 1.5. Asignar Elastic IP (Recomendado)

Para que tu IP pública no cambie al reiniciar:

1. Ve a **EC2 → Elastic IPs**
2. Click **"Allocate Elastic IP address"**
3. Click **"Allocate"**
4. Selecciona la IP → **Actions** → **Associate Elastic IP address**
5. Selecciona tu instancia → **Associate**

**Costo**: Gratis mientras esté asociada a una instancia corriendo, $0.005/hora si no está asociada.

---

## Paso 2: Conectar a la Instancia

### 2.1. Obtener IP Pública

1. Ve a **EC2 → Instances**
2. Selecciona tu instancia
3. Copia la **Public IPv4 address** o **Elastic IP**

### 2.2. Conectar vía SSH

**En Mac/Linux**:

```bash
# Dar permisos al archivo .pem
chmod 400 ~/Downloads/financebro-key.pem

# Conectar
ssh -i ~/Downloads/financebro-key.pem ubuntu@<TU-IP-PUBLICA>
```

**En Windows (PowerShell)**:

```powershell
# Usando OpenSSH (incluido en Windows 10+)
ssh -i C:\Users\TuUsuario\Downloads\financebro-key.pem ubuntu@<TU-IP-PUBLICA>
```

**En Windows (PuTTY)**:

1. Abre PuTTY
2. Host Name: `ubuntu@<TU-IP-PUBLICA>`
3. Connection → SSH → Auth → Private key: Selecciona tu `.ppk`
4. Click **Open**

### 2.3. Primera Conexión

Aceptar fingerprint:
```
The authenticity of host '...' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
```

---

## Paso 3: Instalar Dependencias

### 3.1. Actualizar Sistema

```bash
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar herramientas básicas
sudo apt install -y curl git wget vim htop
```

### 3.2. Instalar Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker (para no usar sudo)
sudo usermod -aG docker $USER

# Aplicar cambios de grupo
newgrp docker

# Verificar instalación
docker --version
# Output: Docker version 24.x.x, build...
```

### 3.3. Instalar Docker Compose

```bash
# Instalar Docker Compose
sudo apt install -y docker-compose-plugin

# Verificar instalación
docker compose version
# Output: Docker Compose version v2.x.x
```

### 3.4. Configurar Firewall (Opcional pero Recomendado)

```bash
# Instalar UFW (Ubuntu Firewall)
sudo apt install -y ufw

# Permitir SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw enable

# Ver estado
sudo ufw status
```

---

## Paso 4: Configurar el Proyecto

### 4.1. Clonar Repositorio

```bash
# Ir al directorio home
cd ~

# Clonar repositorio (usa HTTPS o SSH según tu configuración)
git clone https://github.com/tu-usuario/Proyecto-FinanceBro.git

# Entrar al directorio
cd Proyecto-FinanceBro
```

**Si el repositorio es privado**:

```bash
# Opción 1: Usar token de GitHub
git clone https://<TOKEN>@github.com/tu-usuario/Proyecto-FinanceBro.git

# Opción 2: Configurar SSH (recomendado)
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"
cat ~/.ssh/id_ed25519.pub
# Copia la llave pública y agrégala en GitHub Settings → SSH Keys
git clone git@github.com:tu-usuario/Proyecto-FinanceBro.git
```

### 4.2. Configurar Variables de Entorno

```bash
# Crear archivo .env en la raíz del proyecto
nano .env
```

Copia y pega el siguiente contenido (ajusta los valores):

```bash
# ==================== BASE DE DATOS ====================
POSTGRES_USER=financebro
POSTGRES_PASSWORD=<GENERA-PASSWORD-SEGURO-AQUI>
POSTGRES_DB=financebro_db
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=financebro_db

# ==================== REDIS ====================
REDIS_PASSWORD=<GENERA-PASSWORD-SEGURO-AQUI>
REDIS_HOST=redis
REDIS_PORT=6379

# ==================== BACKEND (NESTJS) ====================
NODE_ENV=production
PORT=3000
JWT_SECRET=<GENERA-SECRET-SEGURO-AQUI-64-CARACTERES>
JWT_EXPIRATION=7d

# ==================== N8N ====================
N8N_API_KEY=<TU-API-KEY-DE-N8N>
N8N_HOST=https://tu-instancia.n8n.cloud

# ==================== FRONTEND ====================
VITE_API_URL=/api

# ==================== PGADMIN (OPCIONAL) ====================
PGADMIN_DEFAULT_EMAIL=admin@financebro.com
PGADMIN_DEFAULT_PASSWORD=<PASSWORD-PGADMIN>
```

**Generar passwords seguros**:

```bash
# Generar password para PostgreSQL
openssl rand -base64 32

# Generar JWT secret
openssl rand -hex 64

# Generar password para Redis
openssl rand -base64 32
```

Guarda el archivo: `Ctrl + X` → `Y` → `Enter`

### 4.3. Verificar Archivos Docker

```bash
# Ver estructura del proyecto
ls -la

# Deberías ver:
# - docker-compose.yml (desarrollo)
# - docker-compose.prod.yml (producción) ✅ USAREMOS ESTE
# - .env
# - finance-bro-api/
# - finance-bro-web/
```

---

## Paso 5: Desplegar con Docker Compose

### 5.1. Construir y Levantar Servicios

```bash
# Construir imágenes (primera vez o después de cambios)
docker compose -f docker-compose.prod.yml build

# Levantar todos los servicios en background
docker compose -f docker-compose.prod.yml up -d

# Ver logs en tiempo real
docker compose -f docker-compose.prod.yml logs -f
```

**Esto creará y levantará**:
- PostgreSQL en puerto 5432 (interno)
- Redis en puerto 6379 (interno)
- Backend (NestJS) en puerto 3000 (interno)
- Frontend (Nginx) en puerto 80 (externo)
- pgAdmin en puerto 5050 (opcional)

### 5.2. Verificar Servicios Corriendo

```bash
# Ver servicios activos
docker compose -f docker-compose.prod.yml ps

# Deberías ver algo como:
# NAME                 STATUS       PORTS
# postgres             Up          5432/tcp
# redis                Up          6379/tcp
# backend              Up          3000/tcp
# frontend             Up          0.0.0.0:80->80/tcp
# pgadmin              Up          0.0.0.0:5050->5050/tcp
```

### 5.3. Ejecutar Migraciones

```bash
# Ejecutar migraciones de base de datos
docker compose -f docker-compose.prod.yml exec backend npm run migration:run

# Output esperado:
# query: SELECT * FROM "migrations"
# 0 migrations are already loaded in the database.
# 3 migrations were found in the source code.
# ...Migration Created successfully
```

### 5.4. Ejecutar Seeds (Opcional)

```bash
# Poblar catálogos (entidades, tipos de crédito, etc.)
docker compose -f docker-compose.prod.yml exec backend npm run seed:catalogs

# Output esperado:
# ✅ Catálogos poblados exitosamente
# - 1 entidades financieras creadas
# - 4 tipos de crédito creados
# - 4 tipos de vivienda creados
# ...
```

### 5.5. Verificar que Todo Funciona

```bash
# Verificar logs del backend
docker compose -f docker-compose.prod.yml logs backend | tail -50

# Deberías ver:
# [Nest] LOG [NestApplication] Nest application successfully started
# [Nest] LOG [BootstrapConsole] Application is running on: http://0.0.0.0:3000
```

**Probar desde el navegador**:

1. **Frontend**: `http://<TU-IP-PUBLICA>`
   - Deberías ver la app React

2. **Swagger API**: `http://<TU-IP-PUBLICA>/api/docs`
   - Deberías ver la documentación de la API

3. **pgAdmin** (opcional): `http://<TU-IP-PUBLICA>:5050`
   - Email: admin@financebro.com
   - Password: (el que configuraste en .env)

---

## Paso 6: Configurar Dominio y SSL

### 6.1. Configurar DNS

En tu proveedor de dominio (GoDaddy, Namecheap, Cloudflare, etc.):

1. **Registro A**:
   ```
   Type: A
   Name: @ (o financebro.com)
   Value: <TU-IP-ELASTICA>
   TTL: 300
   ```

2. **Registro A para www** (opcional):
   ```
   Type: A
   Name: www
   Value: <TU-IP-ELASTICA>
   TTL: 300
   ```

3. **Registro A para API** (opcional):
   ```
   Type: A
   Name: api
   Value: <TU-IP-ELASTICA>
   TTL: 300
   ```

Espera 5-15 minutos para propagación DNS.

### 6.2. Instalar Certbot (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Detener contenedor de frontend temporalmente
docker compose -f docker-compose.prod.yml stop frontend
```

### 6.3. Obtener Certificado SSL

```bash
# Obtener certificado para tu dominio
sudo certbot certonly --standalone -d financebro.com -d www.financebro.com

# Seguir instrucciones:
# - Ingresar email
# - Aceptar términos
# - Aceptar compartir email (opcional)

# Los certificados se guardan en:
# /etc/letsencrypt/live/financebro.com/fullchain.pem
# /etc/letsencrypt/live/financebro.com/privkey.pem
```

### 6.4. Configurar Nginx para HTTPS

Edita la configuración de Nginx:

```bash
nano finance-bro-web/nginx-ssl.conf
```

Agrega la siguiente configuración:

```nginx
# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name financebro.com www.financebro.com;
    return 301 https://$host$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name financebro.com www.financebro.com;
    root /usr/share/nginx/html;
    index index.html;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/financebro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/financebro.com/privkey.pem;

    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Proxy API requests al backend
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # React Router - SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.5. Actualizar Docker Compose para SSL

Edita `docker-compose.prod.yml`:

```yaml
services:
  frontend:
    build:
      context: ./finance-bro-web
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"  # Agregar puerto HTTPS
    volumes:
      - ./finance-bro-web/nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro  # Montar certificados
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped
```

### 6.6. Reiniciar con SSL

```bash
# Reconstruir frontend con nueva configuración
docker compose -f docker-compose.prod.yml up -d --build frontend

# Ver logs
docker compose -f docker-compose.prod.yml logs frontend
```

### 6.7. Auto-renovación de Certificados

```bash
# Configurar cron job para renovar automáticamente
sudo crontab -e

# Agregar al final:
0 0,12 * * * certbot renew --quiet && docker compose -f /home/ubuntu/Proyecto-FinanceBro/docker-compose.prod.yml restart frontend
```

---

## Paso 7: Configurar Backups

### 7.1. Script de Backup Automático

Crea un script para hacer backup de PostgreSQL:

```bash
# Crear directorio para backups
mkdir -p ~/backups

# Crear script de backup
nano ~/backup-db.sh
```

Contenido del script:

```bash
#!/bin/bash

# Configuración
PROJECT_DIR="/home/ubuntu/Proyecto-FinanceBro"
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/financebro_backup_$DATE.sql.gz"

# Cargar variables de entorno
source $PROJECT_DIR/.env

# Crear backup
cd $PROJECT_DIR
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > $BACKUP_FILE

# Mantener solo últimos 7 backups
find $BACKUP_DIR -name "financebro_backup_*.sql.gz" -mtime +7 -delete

# Log
echo "$(date): Backup creado: $BACKUP_FILE" >> $BACKUP_DIR/backup.log

# Opcional: Subir a S3
# aws s3 cp $BACKUP_FILE s3://tu-bucket/backups/
```

Dar permisos:

```bash
chmod +x ~/backup-db.sh
```

### 7.2. Programar Backups Automáticos

```bash
# Editar crontab
crontab -e

# Agregar backup diario a las 2 AM
0 2 * * * /home/ubuntu/backup-db.sh
```

### 7.3. Restaurar desde Backup

```bash
# Ver backups disponibles
ls -lh ~/backups/

# Restaurar backup específico
gunzip -c ~/backups/financebro_backup_YYYYMMDD_HHMMSS.sql.gz | \
docker compose -f docker-compose.prod.yml exec -T postgres psql -U financebro -d financebro_db
```

---

## Monitoreo y Mantenimiento

### Comandos Útiles

```bash
# Ver estado de servicios
docker compose -f docker-compose.prod.yml ps

# Ver logs en tiempo real
docker compose -f docker-compose.prod.yml logs -f

# Ver logs de un servicio específico
docker compose -f docker-compose.prod.yml logs -f backend

# Reiniciar todos los servicios
docker compose -f docker-compose.prod.yml restart

# Reiniciar un servicio específico
docker compose -f docker-compose.prod.yml restart backend

# Detener todos los servicios
docker compose -f docker-compose.prod.yml down

# Actualizar código desde GitHub
cd ~/Proyecto-FinanceBro
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build

# Ver uso de recursos
docker stats

# Limpiar contenedores e imágenes no usadas
docker system prune -a
```

### Monitoreo de Sistema

```bash
# Ver uso de CPU y RAM
htop

# Ver espacio en disco
df -h

# Ver uso de disco por Docker
docker system df
```

### Logs de Sistema

```bash
# Ver logs del sistema
sudo journalctl -xe

# Ver logs de Docker daemon
sudo journalctl -u docker
```

---

## Costos Estimados

### AWS EC2

| Instancia  | vCPU | RAM  | Costo/mes | Recomendado para          |
|------------|------|------|-----------|---------------------------|
| t3.small   | 2    | 2 GB | ~$15      | Desarrollo/Testing        |
| t3.medium  | 2    | 4 GB | ~$30      | Producción pequeña ✅     |
| t3.large   | 2    | 8 GB | ~$60      | Producción media          |
| t3.xlarge  | 4    | 16GB | ~$120     | Producción alta demanda   |

### Storage (EBS)

| Tipo | Tamaño | Costo/mes |
|------|--------|-----------|
| gp3  | 30 GB  | ~$2.40    |
| gp3  | 50 GB  | ~$4.00    |
| gp3  | 100 GB | ~$8.00    |

### Otros Costos

- **Elastic IP**: Gratis mientras esté asociada
- **Data Transfer**: ~$0.09/GB (primeros 10 TB)
- **Backups en S3**: ~$0.023/GB/mes (opcional)

### Total Estimado

**Setup inicial (recomendado)**:
- EC2 t3.medium: $30/mes
- EBS 50 GB: $4/mes
- Data Transfer: $5-10/mes (estimado)
- **Total: ~$40-45 USD/mes**

---

## Troubleshooting

### Error: "Cannot connect to Docker daemon"

**Solución**:
```bash
# Verificar que Docker esté corriendo
sudo systemctl status docker

# Si está detenido, iniciarlo
sudo systemctl start docker

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### Error: "Port 80 already in use"

**Solución**:
```bash
# Ver qué está usando el puerto
sudo lsof -i :80

# Detener el proceso
sudo systemctl stop apache2  # o nginx
```

### Error: "Cannot connect to database"

**Solución**:
```bash
# Ver logs de PostgreSQL
docker compose -f docker-compose.prod.yml logs postgres

# Verificar que PostgreSQL esté corriendo
docker compose -f docker-compose.prod.yml ps postgres

# Reiniciar PostgreSQL
docker compose -f docker-compose.prod.yml restart postgres
```

### Aplicación carga lento

**Solución**:
```bash
# Verificar recursos
htop

# Ver uso de Docker
docker stats

# Considerar upgrade de instancia si CPU/RAM están al 100%
```

### Sin espacio en disco

**Solución**:
```bash
# Ver uso de espacio
df -h

# Limpiar imágenes y contenedores viejos
docker system prune -a

# Limpiar logs de Docker
sudo sh -c "truncate -s 0 /var/lib/docker/containers/*/*-json.log"

# Considerar aumentar tamaño del volumen EBS
```

### Certificado SSL expiró

**Solución**:
```bash
# Renovar manualmente
sudo certbot renew

# Reiniciar frontend
docker compose -f docker-compose.prod.yml restart frontend
```

---

## Seguridad Adicional

### 1. Cambiar puerto SSH

```bash
# Editar configuración SSH
sudo nano /etc/ssh/sshd_config

# Cambiar línea:
# Port 22
# Por:
Port 2222

# Reiniciar SSH
sudo systemctl restart sshd

# Actualizar Security Group en AWS para permitir 2222
```

### 2. Instalar Fail2Ban

```bash
# Instalar
sudo apt install -y fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Buscar [sshd] y asegurarse:
# enabled = true
# maxretry = 3
# bantime = 3600

# Iniciar servicio
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 3. Configurar Actualizaciones Automáticas

```bash
# Instalar unattended-upgrades
sudo apt install -y unattended-upgrades

# Configurar
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Checklist de Despliegue

- [ ] Instancia EC2 creada y configurada
- [ ] Security Group configurado correctamente
- [ ] Elastic IP asignada
- [ ] Conectado vía SSH exitosamente
- [ ] Docker y Docker Compose instalados
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas (.env)
- [ ] Servicios desplegados con Docker Compose
- [ ] Migraciones ejecutadas
- [ ] Seeds ejecutados (opcional)
- [ ] Frontend accesible en navegador
- [ ] Swagger API accesible
- [ ] DNS configurado (si aplica)
- [ ] Certificado SSL instalado (si aplica)
- [ ] HTTPS funcionando (si aplica)
- [ ] Backups configurados
- [ ] Monitoreo configurado
- [ ] Firewall configurado (UFW)
- [ ] Fail2Ban instalado (opcional)

---

## Comandos de Referencia Rápida

```bash
# SSH
ssh -i ~/financebro-key.pem ubuntu@<IP>

# Actualizar aplicación
cd ~/Proyecto-FinanceBro
git pull
docker compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker compose -f docker-compose.prod.yml logs -f

# Reiniciar todo
docker compose -f docker-compose.prod.yml restart

# Backup manual
~/backup-db.sh

# Restaurar backup
gunzip -c ~/backups/backup.sql.gz | docker compose -f docker-compose.prod.yml exec -T postgres psql -U financebro -d financebro_db

# Ver recursos
htop
docker stats
df -h
```

---

## CI/CD: Despliegue Continuo con GitHub Actions

### Arquitectura de CI/CD

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│                                                              │
│  developer push to branch                                    │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────┐                                       │
│  │  GitHub Actions  │                                       │
│  └────────┬─────────┘                                       │
│           │                                                  │
│           ├──► CI Pipeline (on push to any branch)          │
│           │    - Lint & Format Check                        │
│           │    - Unit Tests                                 │
│           │    - Build Docker Images                        │
│           │    - Security Scan                              │
│           │                                                  │
│           ├──► CD Pipeline (on push to main)                │
│           │    - Build Production Images                    │
│           │    - Push to Docker Hub/GitHub Registry         │
│           │    - Deploy to EC2                              │
│           │    - Run Migrations                             │
│           │    - Health Check                               │
│           │    - Rollback on Failure                        │
│           │                                                  │
│           └──► Release Pipeline (on tag v*.*.*)             │
│                - Create GitHub Release                      │
│                - Generate Changelog                         │
│                - Notify Team                                │
└─────────────────────────────────────────────────────────────┘
```

---

### Paso 1: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

Agrega los siguientes secrets:

```
EC2_HOST=<TU-IP-ELASTICA>
EC2_USER=ubuntu
EC2_SSH_KEY=<CONTENIDO-DE-TU-PEM-KEY>

DOCKER_USERNAME=<TU-USUARIO-DOCKER-HUB>
DOCKER_PASSWORD=<TU-PASSWORD-DOCKER-HUB>

DATABASE_PASSWORD=<TU-PASSWORD-POSTGRES>
REDIS_PASSWORD=<TU-PASSWORD-REDIS>
JWT_SECRET=<TU-JWT-SECRET>
N8N_API_KEY=<TU-N8N-API-KEY>
```

**⚠️ IMPORTANTE**: Nunca subas estos valores al código fuente.

---

### Paso 2: Crear Workflows de GitHub Actions

#### 2.1. CI Pipeline (Testing y Build)

Crea el archivo `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ dev, staging, main ]
  pull_request:
    branches: [ main ]

jobs:
  # ==================== LINT & FORMAT ====================
  lint:
    name: Lint and Format Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies (Backend)
        working-directory: ./finance-bro-api
        run: npm ci

      - name: Lint Backend
        working-directory: ./finance-bro-api
        run: npm run lint

      - name: Install dependencies (Frontend)
        working-directory: ./finance-bro-web
        run: npm ci

      - name: Lint Frontend
        working-directory: ./finance-bro-web
        run: npm run lint

  # ==================== UNIT TESTS ====================
  test-backend:
    name: Backend Unit Tests
    runs-on: ubuntu-latest
    needs: lint

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        working-directory: ./finance-bro-api
        run: npm ci

      - name: Run tests
        working-directory: ./finance-bro-api
        env:
          DATABASE_HOST: localhost
          DATABASE_PORT: 5432
          DATABASE_USER: test
          DATABASE_PASSWORD: test
          DATABASE_NAME: test_db
          REDIS_HOST: localhost
          REDIS_PORT: 6379
          JWT_SECRET: test-secret-key
        run: npm run test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./finance-bro-api/coverage/lcov.info
          flags: backend

  test-frontend:
    name: Frontend Unit Tests
    runs-on: ubuntu-latest
    needs: lint

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        working-directory: ./finance-bro-web
        run: npm ci

      - name: Run tests
        working-directory: ./finance-bro-web
        run: npm run test

  # ==================== BUILD DOCKER IMAGES ====================
  build:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Backend Image
        uses: docker/build-push-action@v5
        with:
          context: ./finance-bro-api
          file: ./finance-bro-api/Dockerfile
          push: false
          tags: financebro-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build Frontend Image
        uses: docker/build-push-action@v5
        with:
          context: ./finance-bro-web
          file: ./finance-bro-web/Dockerfile
          push: false
          tags: financebro-frontend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ==================== SECURITY SCAN ====================
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

#### 2.2. CD Pipeline (Deploy to Production)

Crea el archivo `.github/workflows/cd.yml`:

```yaml
name: CD Pipeline

on:
  push:
    branches: [ main ]
  workflow_dispatch: # Permite deploy manual

jobs:
  # ==================== BUILD & PUSH IMAGES ====================
  build-and-push:
    name: Build and Push Docker Images
    runs-on: ubuntu-latest

    outputs:
      version: ${{ steps.version.outputs.version }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Necesario para obtener tags

      - name: Get version from package.json
        id: version
        run: |
          VERSION=$(node -p "require('./finance-bro-api/package.json').version")
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "Version: $VERSION"

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./finance-bro-api
          file: ./finance-bro-api/Dockerfile
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/financebro-backend:latest
            ${{ secrets.DOCKER_USERNAME }}/financebro-backend:${{ steps.version.outputs.version }}
            ${{ secrets.DOCKER_USERNAME }}/financebro-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./finance-bro-web
          file: ./finance-bro-web/Dockerfile
          push: true
          build-args: |
            VITE_API_URL=/api
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/financebro-frontend:latest
            ${{ secrets.DOCKER_USERNAME }}/financebro-frontend:${{ steps.version.outputs.version }}
            ${{ secrets.DOCKER_USERNAME }}/financebro-frontend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ==================== DEPLOY TO EC2 ====================
  deploy:
    name: Deploy to EC2
    runs-on: ubuntu-latest
    needs: build-and-push
    environment:
      name: production
      url: https://financebro.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Create deployment script
        run: |
          cat > deploy.sh << 'EOF'
          #!/bin/bash
          set -e

          echo "🚀 Starting deployment..."

          # Variables
          PROJECT_DIR="/home/ubuntu/Proyecto-FinanceBro"
          BACKUP_DIR="/home/ubuntu/backups/pre-deploy"
          TIMESTAMP=$(date +%Y%m%d_%H%M%S)

          # Crear backup antes de deploy
          echo "📦 Creating pre-deployment backup..."
          mkdir -p $BACKUP_DIR
          cd $PROJECT_DIR
          docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U financebro financebro_db | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

          # Pull latest code
          echo "📥 Pulling latest code..."
          git pull origin main

          # Update environment variables
          echo "🔧 Updating environment variables..."
          cat > .env << 'ENVEOF'
          POSTGRES_USER=financebro
          POSTGRES_PASSWORD=${{ secrets.DATABASE_PASSWORD }}
          POSTGRES_DB=financebro_db
          DATABASE_HOST=postgres
          DATABASE_PORT=5432
          DATABASE_NAME=financebro_db
          REDIS_PASSWORD=${{ secrets.REDIS_PASSWORD }}
          REDIS_HOST=redis
          REDIS_PORT=6379
          NODE_ENV=production
          PORT=3000
          JWT_SECRET=${{ secrets.JWT_SECRET }}
          JWT_EXPIRATION=7d
          N8N_API_KEY=${{ secrets.N8N_API_KEY }}
          N8N_HOST=https://tu-instancia.n8n.cloud
          VITE_API_URL=/api
          PGADMIN_DEFAULT_EMAIL=admin@financebro.com
          PGADMIN_DEFAULT_PASSWORD=admin123
          ENVEOF

          # Pull latest Docker images
          echo "🐳 Pulling latest Docker images..."
          docker compose -f docker-compose.prod.yml pull

          # Stop old containers
          echo "⏹️  Stopping old containers..."
          docker compose -f docker-compose.prod.yml down

          # Start new containers
          echo "▶️  Starting new containers..."
          docker compose -f docker-compose.prod.yml up -d

          # Wait for services to be healthy
          echo "⏳ Waiting for services to be healthy..."
          sleep 10

          # Run migrations
          echo "🔄 Running database migrations..."
          docker compose -f docker-compose.prod.yml exec -T backend npm run migration:run

          # Health check
          echo "🏥 Running health check..."
          for i in {1..30}; do
            if curl -f http://localhost:3000/health > /dev/null 2>&1; then
              echo "✅ Backend is healthy!"
              break
            fi
            echo "Waiting for backend... ($i/30)"
            sleep 2
          done

          # Check if health check passed
          if ! curl -f http://localhost:3000/health > /dev/null 2>&1; then
            echo "❌ Health check failed! Rolling back..."
            docker compose -f docker-compose.prod.yml down
            # Restore from backup would go here
            exit 1
          fi

          echo "✅ Deployment successful!"
          echo "📊 Version: ${{ needs.build-and-push.outputs.version }}"
          echo "🔗 Commit: ${{ github.sha }}"
          EOF

          chmod +x deploy.sh

      - name: Copy deployment script to EC2
        run: |
          scp -i ~/.ssh/id_rsa deploy.sh ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }}:/tmp/deploy.sh

      - name: Execute deployment on EC2
        run: |
          ssh -i ~/.ssh/id_rsa ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} 'bash /tmp/deploy.sh'

      - name: Clean up
        if: always()
        run: |
          ssh -i ~/.ssh/id_rsa ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} 'rm -f /tmp/deploy.sh'

      - name: Notify deployment
        if: success()
        run: |
          echo "✅ Deployment successful to production!"
          echo "Version: ${{ needs.build-and-push.outputs.version }}"
          echo "Commit: ${{ github.sha }}"
          echo "URL: https://financebro.com"

      - name: Notify failure
        if: failure()
        run: |
          echo "❌ Deployment failed!"
          echo "Check logs and consider rolling back."
```

#### 2.3. Release Pipeline (Tags y Versiones)

Crea el archivo `.github/workflows/release.yml`:

```yaml
name: Release Pipeline

on:
  push:
    tags:
      - 'v*.*.*' # Trigger en tags tipo v1.0.0

jobs:
  create-release:
    name: Create GitHub Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get version from tag
        id: version
        run: |
          TAG=${GITHUB_REF#refs/tags/}
          echo "tag=$TAG" >> $GITHUB_OUTPUT
          echo "version=${TAG#v}" >> $GITHUB_OUTPUT

      - name: Generate changelog
        id: changelog
        run: |
          # Obtener último tag anterior
          PREVIOUS_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")

          if [ -z "$PREVIOUS_TAG" ]; then
            COMMITS=$(git log --pretty=format:"- %s (%h)" HEAD)
          else
            COMMITS=$(git log --pretty=format:"- %s (%h)" $PREVIOUS_TAG..HEAD)
          fi

          echo "changelog<<EOF" >> $GITHUB_OUTPUT
          echo "$COMMITS" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.version.outputs.tag }}
          release_name: Release ${{ steps.version.outputs.tag }}
          body: |
            ## 🎉 Release ${{ steps.version.outputs.tag }}

            ### 📝 Changelog
            ${{ steps.changelog.outputs.changelog }}

            ### 🐳 Docker Images
            ```bash
            docker pull ${{ secrets.DOCKER_USERNAME }}/financebro-backend:${{ steps.version.outputs.version }}
            docker pull ${{ secrets.DOCKER_USERNAME }}/financebro-frontend:${{ steps.version.outputs.version }}
            ```

            ### 📦 Assets
            - Backend: `financebro-backend:${{ steps.version.outputs.version }}`
            - Frontend: `financebro-frontend:${{ steps.version.outputs.version }}`
          draft: false
          prerelease: false
```

---

### Paso 3: Control de Versiones (Semantic Versioning)

#### 3.1. Estructura de Versionado

Usamos **Semantic Versioning** (SemVer):

```
v<MAJOR>.<MINOR>.<PATCH>

Ejemplos:
- v1.0.0 - Release inicial
- v1.1.0 - Nueva funcionalidad (sin breaking changes)
- v1.1.1 - Bug fix
- v2.0.0 - Breaking changes
```

**Reglas**:
- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs

#### 3.2. Crear un Release

```bash
# 1. Actualizar versión en package.json
cd finance-bro-api
npm version patch  # o minor, o major
# Esto actualiza package.json y crea un commit

# 2. Crear tag
git tag -a v1.0.1 -m "Release v1.0.1: Bug fixes"

# 3. Push tag y commit
git push origin main --follow-tags

# GitHub Actions automáticamente:
# - Ejecutará CI pipeline
# - Creará el release
# - Construirá y publicará imágenes Docker
# - Desplegará a producción (si está en main)
```

#### 3.3. Actualizar package.json

Ambos `package.json` deben tener la misma versión:

```json
{
  "name": "finance-bro-api",
  "version": "1.0.1",
  ...
}
```

---

### Paso 4: Estrategias de Rollback

#### 4.1. Rollback Automático

El workflow de CD incluye health checks. Si fallan, hace rollback automático.

#### 4.2. Rollback Manual

```bash
# Conectar a EC2
ssh -i ~/financebro-key.pem ubuntu@<IP>

# Ver tags de Docker disponibles
docker images | grep financebro

# Opción 1: Volver a versión anterior específica
cd ~/Proyecto-FinanceBro
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml pull backend:v1.0.0 # versión anterior
docker compose -f docker-compose.prod.yml up -d

# Opción 2: Restaurar desde backup
gunzip -c ~/backups/pre-deploy/backup_YYYYMMDD_HHMMSS.sql.gz | \
docker compose -f docker-compose.prod.yml exec -T postgres psql -U financebro -d financebro_db

# Opción 3: Git rollback
git revert <commit-sha>
git push origin main
# GitHub Actions desplegará automáticamente
```

---

### Paso 5: Gestión de Múltiples Ambientes

#### 5.1. Estructura de Branches

```
main (producción)
  │
  ├─── staging (pre-producción)
  │      │
  │      └─── feature/nueva-funcionalidad
  │      └─── fix/corregir-bug
  │
  └─── dev (desarrollo)
```

#### 5.2. Configurar Ambientes en GitHub

1. Ve a **Settings** → **Environments**
2. Crear 3 ambientes:

**Development**:
- No requiere aprobación
- Deploy automático en push a `dev`

**Staging**:
- No requiere aprobación
- Deploy automático en push a `staging`

**Production**:
- Requiere aprobación manual
- Deploy automático en push a `main`
- Protection rules: Require reviewers (1-2)

#### 5.3. Workflow Multi-Ambiente

Actualiza `.github/workflows/cd.yml`:

```yaml
name: CD Pipeline Multi-Environment

on:
  push:
    branches: [ dev, staging, main ]

jobs:
  determine-environment:
    runs-on: ubuntu-latest
    outputs:
      environment: ${{ steps.set-env.outputs.environment }}
      ec2_host: ${{ steps.set-env.outputs.ec2_host }}

    steps:
      - id: set-env
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
            echo "ec2_host=${{ secrets.EC2_HOST_PROD }}" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref }}" == "refs/heads/staging" ]]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
            echo "ec2_host=${{ secrets.EC2_HOST_STAGING }}" >> $GITHUB_OUTPUT
          else
            echo "environment=development" >> $GITHUB_OUTPUT
            echo "ec2_host=${{ secrets.EC2_HOST_DEV }}" >> $GITHUB_OUTPUT
          fi

  deploy:
    needs: determine-environment
    runs-on: ubuntu-latest
    environment:
      name: ${{ needs.determine-environment.outputs.environment }}
      url: https://${{ needs.determine-environment.outputs.environment }}.financebro.com

    steps:
      # ... resto del workflow de deploy
      # Usa: ${{ needs.determine-environment.outputs.ec2_host }}
```

---

### Paso 6: Notificaciones y Monitoreo

#### 6.1. Notificaciones en Slack

Agrega al final de cada workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      ${{ github.workflow }} - ${{ job.status }}
      Branch: ${{ github.ref }}
      Commit: ${{ github.sha }}
      Author: ${{ github.actor }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### 6.2. Badge de Status

Agrega al README.md:

```markdown
![CI Pipeline](https://github.com/tu-usuario/Proyecto-FinanceBro/actions/workflows/ci.yml/badge.svg)
![CD Pipeline](https://github.com/tu-usuario/Proyecto-FinanceBro/actions/workflows/cd.yml/badge.svg)
```

---

### Paso 7: Configuración Adicional

#### 7.1. Configurar Docker Hub

Si no tienes cuenta en Docker Hub:

1. Registrarse en https://hub.docker.com
2. Crear repositorios:
   - `financebro-backend`
   - `financebro-frontend`

#### 7.2. .dockerignore para Optimizar Builds

Crea/actualiza `.dockerignore` en cada proyecto:

```
# finance-bro-api/.dockerignore
node_modules
npm-debug.log
dist
coverage
.git
.env
.env.*
Dockerfile
docker-compose*.yml
README.md
.github
```

#### 7.3. Git Hooks Locales (Opcional)

Instalar Husky para pre-commit hooks:

```bash
cd finance-bro-api
npm install --save-dev husky lint-staged

# Configurar en package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.ts": ["eslint --fix", "git add"]
  }
}
```

---

## Workflow de Desarrollo Completo

### 1. Crear Nueva Feature

```bash
# Crear branch desde dev
git checkout dev
git pull origin dev
git checkout -b feature/nueva-funcionalidad

# Hacer cambios
code .

# Commit
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push
git push origin feature/nueva-funcionalidad
```

### 2. Pull Request

1. Crear PR en GitHub: `feature/nueva-funcionalidad` → `dev`
2. GitHub Actions ejecuta CI pipeline automáticamente
3. Revisar tests y resultados
4. Aprobar y mergear PR

### 3. Deploy a Staging

```bash
# Mergear dev a staging
git checkout staging
git merge dev
git push origin staging

# GitHub Actions despliega automáticamente a staging
```

### 4. Deploy a Production

```bash
# Después de probar en staging
git checkout main
git merge staging

# Actualizar versión
cd finance-bro-api
npm version minor  # v1.1.0

# Push con tag
git push origin main --follow-tags

# GitHub Actions:
# 1. Ejecuta CI
# 2. Espera aprobación manual (si configurado)
# 3. Despliega a producción
# 4. Crea release en GitHub
```

---

## Checklist de CI/CD

- [ ] GitHub Actions configurado (.github/workflows/)
- [ ] Secrets configurados en GitHub
- [ ] Docker Hub configurado
- [ ] Ambientes configurados (dev, staging, prod)
- [ ] Instancias EC2 para cada ambiente (opcional)
- [ ] SSH keys configuradas
- [ ] Health checks funcionando
- [ ] Rollback strategy probada
- [ ] Notificaciones configuradas (Slack/Email)
- [ ] Badges de CI/CD en README
- [ ] Documentación de versioning actualizada
- [ ] Pre-commit hooks configurados (opcional)
- [ ] Backups pre-deploy funcionando

---

## Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Semantic Versioning](https://semver.org/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**¡Listo!** Tu aplicación FinanceBro ahora tiene CI/CD completo con despliegue automático y control de versiones 🚀🔄
