// Gemini usa estas guías como parte de su conocimiento para el prompt IDENTIFIED.
// No son tools de Gemini — son datos estáticos que Gemini puede referenciar.
export const TROUBLESHOOT_GUIDES = {
  sin_internet: {
    steps: [
      '1. Verifica que el cable de red esté bien conectado al router y a la toma de pared.',
      '2. Apaga el router desconectando el cable de corriente. Espera 30 segundos.',
      '3. Reconecta el cable y espera 2 minutos a que el router se reinicie.',
      '4. Describe qué luces ves en el router (encendidas, parpadeando, apagadas).',
      '5. Intenta conectarte con otro dispositivo. ¿Tampoco tiene internet?',
    ],
    escalate: 'Si tras reiniciar las luces no vuelven a su estado normal, abrir ticket técnico.'
  },
  internet_lento: {
    steps: [
      '1. Visita fast.com o speedtest.net y dime los resultados.',
      '2. ¿Cuántos dispositivos están conectados ahora?',
      '3. Prueba conectar con cable directo al router (sin WiFi). ¿Mejora la velocidad?',
      '4. Apaga y enciende el router (30 segundos desconectado).',
      '5. ¿La lentitud es todo el día o en ciertos horarios?',
    ],
    escalate: 'Si la velocidad medida es muy inferior al plan contratado incluso con cable directo, abrir ticket.'
  },
  wifi_no_aparece: {
    steps: [
      '1. Verifica que el router esté encendido (¿hay luces?).',
      '2. ¿Otros dispositivos sí ven tu red WiFi?',
      '3. En tu dispositivo, desactiva el WiFi y vuélvelo a activar.',
      '4. Busca redes disponibles. ¿Aparece alguna red con nombre similar al tuyo?',
      '5. Intenta acercarte al router. ¿Aparece la red desde cerca?',
    ],
    escalate: 'Si ningún dispositivo ve la red WiFi, puede ser un problema de configuración o hardware.'
  },
  conexion_intermitente: {
    steps: [
      '1. ¿Con qué frecuencia se cae? (cada hora, minutos, aleatorio)',
      '2. ¿Ocurre tanto en WiFi como con cable directo?',
      '3. Revisa que el cable coaxial o de fibra esté bien conectado al router.',
      '4. ¿Hubo cortes de luz recientes en tu zona?',
      '5. ¿El problema empezó después de algún cambio (mover el router, lluvia, etc.)?',
    ],
    escalate: 'Caídas frecuentes que no se resuelven con reinicio generalmente requieren revisión técnica.'
  }
}
