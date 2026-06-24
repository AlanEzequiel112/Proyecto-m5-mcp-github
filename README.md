# Proyecto M5 - MCP Server para GitHub

MCP Server desarrollado con Node.js y TypeScript que permite a un agente de IA ejecutar operaciones comunes en GitHub usando lenguaje natural.

## ¿Qué hace?

El servidor expone tools para interactuar con GitHub mediante Model Context Protocol (MCP). Estas tools permiten:

- Crear repositorios
- Listar repositorios
- Crear issues
- Listar issues
- Crear o modificar archivos mediante commits

## Tecnologías

- Node.js 18+
- TypeScript
- Model Context Protocol SDK
- Octokit
- Zod
- Vitest
- dotenv

## Instalación

```bash
npm install