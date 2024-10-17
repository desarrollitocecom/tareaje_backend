module.exports = (sequelize, DataTypes) => {
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
            type: DataTypes.STRING,
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
        lugar_trabajo: {
            type: DataTypes.STRING,
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
        }
    }, {
        tableName: 'Empleados',
        timestamps: true
    });

    // Asociaciones
    /*
    Empleado.associate = (db) => {
        // Relación con la tabla Cargo
        Empleado.belongsTo(db.Cargo, {
            foreignKey: 'cargo',
            as: 'cargo'
        });

        // Relación con la tabla Turno
        Empleado.belongsTo(db.Turno, {
            foreignKey: 'turno',
            as: 'turno'
        });

        // Relación con la tabla Régimen Laboral
        Empleado.belongsTo(db.RegimenLaboral, {
            foreignKey: 'regimen_laboral',
            as: 'regimenLaboral'
        });

        // Relación con la tabla Sexo
        Empleado.belongsTo(db.Sexo, {
            foreignKey: 'sexo',
            as: 'sexo'
        });

        // Relación con la tabla Jurisdiccion
        Empleado.belongsTo(db.Jurisdiccion, {
            foreignKey: 'jurisdiccion',
            as: 'jurisdiccion'
        });

        // Relación con la tabla Grado de Estudios
        Empleado.belongsTo(db.GradoEstudios, {
            foreignKey: 'grado_estudios',
            as: 'gradoEstudios'
        });

        // Relación con la tabla Subgerencia
        Empleado.belongsTo(db.Subgerencia, {
            foreignKey: 'subgerencia',
            as: 'subgerencia'
        });

        // Relación con la tabla Función
        Empleado.belongsTo(db.Funcion, {
            foreignKey: 'funcion',
            as: 'funcion'
        });
    };*/

    return Empleado;
};