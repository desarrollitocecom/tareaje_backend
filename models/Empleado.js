const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Empleado = sequelize.define('Empleado', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombres: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dni: {
            type: DataTypes.STRING(8),  
            allowNull: false,
            unique: true
        },
        ruc: {
            type: DataTypes.STRING,
            allowNull: true
        },
        hijos: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        edad: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        f_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        domicilio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        celular: {
            type: DataTypes.STRING,
            allowNull: true
        },
        f_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        foto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'Empleados',
        timestamps: true
    });

    // Asociaciones
    
    Empleado.associate = (db) => {
        // Relación con la tabla Cargo
        Empleado.belongsTo(db.Cargo, {
            foreignKey: 'id_cargo',
            as: 'cargo'
        });

        // Relacion empleado con usuario
        db.Usuario.hasOne(Empleado, {
            foreignKey: {
                name: 'id_usuario',
                allowNull: true, // Permitir que el empleado exista sin usuario al principio
            },
            as: 'id_usuario'
        });

        // Relación con la tabla Turno
        Empleado.belongsTo(db.Turno, {
            foreignKey: 'id_turno',
            as: 'turno'
        });

        // Relación con la tabla Régimen Laboral
        Empleado.belongsTo(db.RegimenLaboral, {
            foreignKey: 'id_regimen_laboral',
            as: 'regimenLaboral'
        });

        // Relación con la tabla Sexo
        Empleado.belongsTo(db.Sexo, {
            foreignKey: 'id_sexo',
            as: 'sexo'
        });

        // Relación con la tabla Jurisdiccion
        Empleado.belongsTo(db.Jurisdiccion, {
            foreignKey: 'id_jurisdiccion',
            as: 'jurisdiccion'
        });

        // Relación con la tabla Grado de Estudios
        Empleado.belongsTo(db.GradoEstudios, {
            foreignKey: 'id_grado_estudios',
            as: 'gradoEstudios'
        });

        // Relación con la tabla Subgerencia
        Empleado.belongsTo(db.Subgerencia, {
            foreignKey: 'id_subgerencia',
            as: 'subgerencia'
        });

        // Relación con la tabla Función
        Empleado.belongsTo(db.Funcion, {
            foreignKey: 'id_funcion',
            as: 'funcion'
        });     
    };

    return Empleado;
}
