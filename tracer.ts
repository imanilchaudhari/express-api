import { config } from 'dotenv';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { Resource } from '@opentelemetry/resources';
import { trace } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

config();

// Initialize the tracer provider
const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    'service.name': 'express-api-service'
  })
});

const zipkinExporter = new ZipkinExporter({
  serviceName: 'express-api-service',
  url: process.env.ZIPKIN_URL || 'http://localhost:9411/api/v2/spans'
});
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(zipkinExporter));

// Register the tracer provider
tracerProvider.register();

registerInstrumentations({
  tracerProvider: tracerProvider,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation()
  ]
});

// Create and export a global tracer instance
export default trace.getTracer('express-api-service');
