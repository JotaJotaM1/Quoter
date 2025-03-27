import React, { useState } from 'react';
import '../styles/components/Quote.css';

const services = {
    reparacion: { labor: 60000, materials: 25000, transport: 150000, dailyArea: 15 },
    pintura: { labor: 12000, materials: 20000, transport: 50000, dailyArea: 20 },
    construccion: { labor: 80000, materials: 40000, transport: 200000, dailyArea: 10 }
};

const initialForm = {
    name: '',
    areaSize: '',
    rooms: '',
    service: 'reparacion',
    includeMaterials: null
};

const QuoteForm = () => {
    const [formData, setFormData] = useState(initialForm);
    const [quote, setQuote] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Limpiar error cuando el usuario interactúa
        if (name === 'includeMaterials') {
            setError(null);
        }
    };

    const calculateQuote = () => {
        const area = parseFloat(formData.areaSize) || 0;
        const rooms = parseInt(formData.rooms) || 0;
        const service = services[formData.service];

        // Validación adicional para valores negativos
        if (area < 0 || rooms < 0) {
            setError('Los valores no pueden ser negativos');
            setLoading(false);
            return;
        }

        const includeMaterials = formData.includeMaterials === 'yes';
        const laborCost = area * service.labor;
        const materialsCost = includeMaterials ? area * service.materials : 0;
        const roomsCost = rooms * 200000;
        const transportCost = service.transport;

        const total = laborCost + materialsCost + roomsCost + transportCost;
        const estimatedDays = Math.ceil(area / service.dailyArea);

        setQuote({ laborCost, materialsCost, roomsCost, transportCost, total, estimatedDays });
        setLoading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validación mejorada
        if (formData.includeMaterials === null) {
            setError('Por favor, selecciona si deseas incluir materiales.');
            return;
        }
        
        if (!formData.areaSize || !formData.rooms) {
            setError('Por favor, completa todos los campos requeridos.');
            return;
        }

        setError(null);
        setLoading(true);
        setTimeout(() => {
            calculateQuote();
        }, 1000);
    };

    const handleReset = () => {
        setFormData(initialForm);
        setQuote(null);
        setError(null);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <section className={isDarkMode ? "dark" : ""}>
            <button className="toggle-mode" onClick={toggleDarkMode}>
                {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </button>
            
            <form className="quote-form" onSubmit={handleSubmit}>
                <h2>Cotizador Profesional</h2>

                {error && <div className="error-message">{error}</div>}

                <label>Nombre Completo:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />

                <label>Tipo de Servicio:</label>
                <select name="service" value={formData.service} onChange={handleChange}>
                    <option value="reparacion">Reparación</option>
                    <option value="pintura">Pintura</option>
                    <option value="construccion">Construcción</option>
                </select>

                <label>Superficie Total (m²):</label>
                <input 
                    type="number" 
                    name="areaSize" 
                    value={formData.areaSize} 
                    onChange={handleChange} 
                    required 
                    min="0"
                />

                <label>Cantidad de Habitaciones:</label>
                <input 
                    type="number" 
                    name="rooms" 
                    value={formData.rooms} 
                    onChange={handleChange} 
                    required 
                    min="0"
                />

                <label>¿Incluir materiales?</label>
                <select
                    name="includeMaterials"
                    value={formData.includeMaterials || ''}
                    onChange={handleChange}
                    required
                    className={formData.includeMaterials === null ? 'placeholder-option' : ''}
                >
                    <option value="" disabled hidden>Selecciona una opción</option>
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                </select>

                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? "Calculando..." : "Calcular Cotización"}
                    </button>
                    <button type="button" className="reset-btn" onClick={handleReset}>Limpiar</button>
                </div>

                {quote && (
                    <div className="quote-result">
                        <h3>Desglose de Cotización</h3>
                        <p><strong>Mano de Obra:</strong> ${quote.laborCost.toLocaleString('es-CO')} COP</p>
                        {formData.includeMaterials === 'yes' && <p><strong>Materiales:</strong> ${quote.materialsCost.toLocaleString('es-CO')} COP</p>}
                        <p><strong>Costo por Habitaciones:</strong> ${quote.roomsCost.toLocaleString('es-CO')} COP</p>
                        <p><strong>Transporte:</strong> ${quote.transportCost.toLocaleString('es-CO')} COP</p>
                        <p><strong>Total:</strong> ${quote.total.toLocaleString('es-CO')} COP</p>
                        <p><strong>Días estimados:</strong> {quote.estimatedDays} días</p>
                    </div>
                )}
            </form>
        </section>
    );
};

export default QuoteForm;