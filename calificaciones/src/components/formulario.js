import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import styles from '../styles/styles';

class Formulario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identificacion: '',
      nombres: '',
      asignatura: '',
      nota1: '',
      nota2: '',
      nota3: '',
      definitiva: '',
      observacion: '',
      estudiantes: [],
      estudianteEncontrado: null,
      mostrarEstudiantes: false,
    };
  }

  // Función de validación
  validarCampos = () => {
    const { identificacion, nombres, asignatura, nota1, nota2, nota3 } = this.state;

    // Verifica que todos los campos obligatorios estén llenos
    if (!identificacion || !nombres || !asignatura || !nota1 || !nota2 || !nota3) {
      this.setState({
        definitiva: '',
        observacion: 'Todos los campos son obligatorios',
      });
      return false;
    }

    // Verifica que las notas estén dentro del rango (0-5)
    if (nota1 < 0 || nota1 > 5 || nota2 < 0 || nota2 > 5 || nota3 < 0 || nota3 > 5) {
      this.setState({
        definitiva: '',
        observacion: 'Notas fuera de rango (0-5)',
      });
      return false;
    }

    return true; // Todos los campos son válidos
  };

  calcularDefinitiva = () => {
    // Validar los campos antes de calcular
    if (!this.validarCampos()) {
      return;
    }

    // Obtén las notas como números
    const nota1 = parseFloat(this.state.nota1);
    const nota2 = parseFloat(this.state.nota2);
    const nota3 = parseFloat(this.state.nota3);

    // Calcula la definitiva (promedio ponderado)
    const definitiva = (nota1 * 0.3 + nota2 * 0.35 + nota3 * 0.35).toFixed(2);

    // Determina la observación
    let observacion = '';
    if (definitiva >= 3) {
      observacion = 'Gana';
    } else if (definitiva < 2) {
      observacion = 'Pierde';
    } else {
      observacion = 'Habilita';
    }

    this.setState({
      definitiva: definitiva.toString(),
      observacion: observacion,
    });
  };

  limpiarFormulario = () => {
    this.setState({
      identificacion: '',
      nombres: '',
      asignatura: '',
      nota1: '',
      nota2: '',
      nota3: '',
      definitiva: '',
      observacion: '',
      estudianteEncontrado: null, // Limpia la información del estudiante encontrado
      mostrarEstudiantes: false, // Oculta el FlatList
    });
  };

  // Función para agregar un estudiante a la lista
  agregarEstudiante = () => {
    // Validar los campos antes de agregar al estudiante
    if (!this.validarCampos()) {
      return;
    }

    // Obtener los datos del estudiante desde el estado
    const {
      identificacion,
      nombres,
      asignatura,
      nota1,
      nota2,
      nota3,
      estudiantes,
    } = this.state;

    // Crear un nuevo objeto de estudiante
    const nuevoEstudiante = {
      identificacion,
      nombres,
      asignatura,
      nota1: parseFloat(nota1),
      nota2: parseFloat(nota2),
      nota3: parseFloat(nota3),
    };

    // Agregar el nuevo estudiante al arreglo de estudiantes
    this.setState((prevState) => ({
      estudiantes: [...prevState.estudiantes, nuevoEstudiante],
      definitiva: '',
      observacion: 'Estudiante agregado correctamente',
      mostrarEstudiantes: false, // Oculta el FlatList al agregar un estudiante
    }));
  };

  buscarInformacion = () => {
    const { identificacion, estudiantes } = this.state;

    // Buscar el estudiante por identificación en el arreglo de estudiantes
    const estudianteEncontrado = estudiantes.find((estudiante) => estudiante.identificacion === identificacion);

    if (estudianteEncontrado) {
      // Estudiante encontrado, muestra su información
      this.setState({
        observacion: '',
        definitiva: '',
        estudianteEncontrado, // Agrega el estudiante encontrado al estado
        mostrarEstudiantes: false, // Oculta el FlatList al buscar un estudiante
      });
    } else {
      // Estudiante no encontrado, muestra un mensaje de error
      this.setState({
        observacion: 'Estudiante inexistente',
        definitiva: '',
        estudianteEncontrado: null, // Limpia la información del estudiante encontrado
        mostrarEstudiantes: false, // Oculta el FlatList al buscar un estudiante
      });
    }
  };

  mostrarEstudiantes = () => {
    this.setState({
      mostrarEstudiantes: true, // Muestra el FlatList
    });
  };

  render() {
    const { estudiantes, estudianteEncontrado, mostrarEstudiantes } = this.state;
    let observacionStyle = {};

    if (this.state.observacion === 'Gana') {
      observacionStyle = styles.observacionGana;
    } else if (this.state.observacion === 'Pierde') {
      observacionStyle = styles.observacionPierde;
    } else if (this.state.observacion === 'Habilita') {
      observacionStyle = styles.observacionHabilita;
    }

    return (
      <View>
        <TextInput
          placeholder="Identificación"
          value={this.state.identificacion}
          onChangeText={(text) => this.setState({ identificacion: text })}
        />
        <TextInput
          placeholder="Nombres"
          value={this.state.nombres}
          onChangeText={(text) => this.setState({ nombres: text })}
        />
        <TextInput
          placeholder="Asignatura"
          value={this.state.asignatura}
          onChangeText={(text) => this.setState({ asignatura: text })}
        />
        <TextInput
          placeholder="Nota 1"
          value={this.state.nota1}
          onChangeText={(text) => this.setState({ nota1: text })}
        />
        <TextInput
          placeholder="Nota 2"
          value={this.state.nota2}
          onChangeText={(text) => this.setState({ nota2: text })}
        />
        <TextInput
          placeholder="Nota 3"
          value={this.state.nota3}
          onChangeText={(text) => this.setState({ nota3: text })}
        />
        <Button title="Calcular/Guardar" onPress={() => {
          this.agregarEstudiante();
          this.calcularDefinitiva();
        }} />
        <Button title="Limpiar" onPress={this.limpiarFormulario} />
        <Button title="Buscar" onPress={() => {
          this.buscarInformacion();
          this.mostrarEstudiantes(); // Muestra la lista de estudiantes al buscar
        }} />
        <Text style={observacionStyle}>Definitiva: {this.state.definitiva}</Text>
        <Text style={observacionStyle}>Observación: {this.state.observacion}</Text>

        {estudianteEncontrado && (
          <View style={styles.estudianteInfo}>
            <Text>Información del Estudiante:</Text>
            <Text>Identificación: {estudianteEncontrado.identificacion}</Text>
            <Text>Nombres: {estudianteEncontrado.nombres}</Text>
            <Text>Asignatura: {estudianteEncontrado.asignatura}</Text>
            <Text>Definitiva: {(estudianteEncontrado && (estudianteEncontrado.nota1 * 0.3 + estudianteEncontrado.nota2 * 0.35 + estudianteEncontrado.nota3 * 0.35).toFixed(2)) || ''}</Text>
          </View>
        )}
      </View>
    );
  }
}

export default Formulario;