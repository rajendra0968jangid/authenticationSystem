const { DataTypes } = new require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id:{type:DataTypes.INTEGER,allowNull: false,autoIncrement:true,primaryKey:true},
        role_name: { type: DataTypes.STRING,},
        role_code: { type: DataTypes.STRING },
       // phone_number: { type: DataTypes.INTEGER,},
        //created_at: { type: DataTypes.DATE},
        //updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        //deleted_at: { type: DataTypes.DATE },
        // isVerified: {
        //     type: DataTypes.VIRTUAL,
        //     get() { return !!(this.verified || this.passwordReset); }
        // }
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: true,
        sequelize,
        paranoid: true,
      
        // If you want to give a custom name to the deletedAt column
        deletedAt: 'destroyTime' 
        // defaultScope: {
        //     // exclude password hash by default
        //     attributes: { exclude: ['passwordHash'] }
        // },
        // scopes: {
        //     // include hash with this scope
        //     withHash: { attributes: {}, }
        // }        
    };

    return sequelize.define('Roles', attributes,options);
}