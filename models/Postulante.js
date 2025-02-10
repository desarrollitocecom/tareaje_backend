const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Postulante = sequelize.define('Postulante', {
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
        f_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        talla: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        hijos: {
            type: DataTypes.INTEGER,
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
        f_registro: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        f_evaluacion: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        carrera: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cv: {
            type: DataTypes.STRING,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cuenta: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cci: {
            type: DataTypes.STRING,
            allowNull: true
        },
        clave_sol: {
            type: DataTypes.STRING,
            allowNull: true
        },
        clave_cul: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_distrito: {
            type: DataTypes.INTEGER,
            references: { model: 'Distritos', key: 'id' }
        },
        id_entidad: {
            type: DataTypes.INTEGER,
            references: { model: 'Entidades', key: 'id' }
        },
        id_cargo: {
            type: DataTypes.INTEGER,
            references: { model: 'Cargos', key: 'id' }
        },
        id_sexo: {
            type: DataTypes.INTEGER,
            references: { model: 'Sexos', key: 'id' }
        },
        id_regimen_laboral: {
            type: DataTypes.INTEGER,
            references: { model: 'RegimenLaborales', key: 'id' }
        },
        id_grado_estudios: {
            type: DataTypes.INTEGER,
            references: { model: 'GradoDeEstudios', key: 'id' }
        },
        id_subgerencia: {
            type: DataTypes.INTEGER,
            references: { model: 'Subgerencias', key: 'id' }
        },
        prueba_psicologica: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        prueba_fisica: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        state_blacklist: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        state_accept: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        id_convocatoria: {
            type: DataTypes.INTEGER,
            references: { model: 'Convocatorias', key: 'id' }
        }
    },{
        tableName: 'Postulantes',
        timestamps: true
    });

    Postulante.associate = (db) => {
        Postulante.belongsTo(db.Distrito, { foreignKey: 'id_distrito', as: 'distrito' });
        Postulante.belongsTo(db.Entidad, { foreignKey: 'id_entidad', as: 'entidad' });
        Postulante.belongsTo(db.Cargo, { foreignKey: 'id_cargo', as: 'cargo' });
        Postulante.belongsTo(db.Sexo, { foreignKey: 'id_sexo', as: 'sexo' });
        Postulante.belongsTo(db.RegimenLaboral, { foreignKey: 'id_regimen_laboral', as: 'regimenLaboral' });
        Postulante.belongsTo(db.GradoEstudios, { foreignKey: 'id_grado_estudios', as: 'gradoEstudios' });
        Postulante.belongsTo(db.Subgerencia, { foreignKey: 'id_subgerencia', as: 'subgerencia' });
        Postulante.belongsTo(db.Convocatoria, { foreignKey: 'id_convocatoria', as: 'convocatoria' });
    };

    return Postulante;
};