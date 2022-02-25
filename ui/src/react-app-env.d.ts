/// <reference types="react-scripts" />

interface IAlert {
    key: Date
    type: 'error' | 'warning' | 'info' | 'success';
    message: string;
}