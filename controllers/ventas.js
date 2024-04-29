import ventas from "../models/ventas.js";
import productos from "../models/productos.js";
const httpVenta = {
  getVentas1: async (req, res) => {
    const Venta = await ventas.find();
    res.json({ Venta });
  },

  getVentas: async (req, res) => {
    const { busqueda } = req.query;
    const Venta = await ventas
      .find({
        $or: [
          { createAt: new RegExp(busqueda, "i") },
          { numfact: new RegExp(busqueda, "i") },
          { fecha: new RegExp(busqueda, "i") },
          
        ],
      })
      .populate({ createAt, numfact, fecha });
    console.log(Venta);

    res.json({ Venta });
  },

  getVentasId: async (req, res) => {
    const { id } = req.params;
    const Venta = await ventas.findById(id);
    console.log(Venta);
    res.json({ Venta });
  },

  getlistarVentasEntreFechas: async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query;
      const ventasEntreFechas = await ventas.find({
        createAt: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }
      });
  
      res.json({ ventasEntreFechas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al buscar las ventas entre las fechas especificadas" });
    }
  },  

  getTotalVentas: async (req, res) => {
    try {
      const totalVentas = await ventas.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$total" }
          }
        }
      ]);

      // Si no hay ventas, devolver 0 como total
      const total = totalVentas.length > 0 ? totalVentas[0].total : 0;

      res.json({ total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el total de ventas" });
    }
  },


   
  postVentas: async (req, res) => {
    try {
      const { idproducto, idcliente, idsede, cantidad } = req.body;

    
      const producto = await productos.findById(idproducto);
      if (!producto) {
        return res.status(404).json({ error: "El producto no existe" });
      }

      
      const valorUnidad = producto.valor;
      const total = valorUnidad * cantidad;

      
      if (producto.cantidad < cantidad) {
        return res.status(400).json({ error: "No hay suficiente cantidad en inventario" });
      }

      
      const Venta = new ventas({
        idproducto,idcliente,idsede,valorUnidad,cantidad,total, 
        
        });
        
      

      
      await Venta.save();

     
      producto.cantidad -= cantidad;
      await producto.save();

      res.json({ Venta });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "No se pudo crear el registro" });
    }
  },
  putVentas: async (req, res) => {
    const { id } = req.params;
    const { _id, estado, createAt, ...resto } = req.body;
    console.log(resto);

    const Venta = await ventas.findByIdAndUpdate(id, resto, {
      new: true,
    });
    res.json({ Venta });
  },
 
  };

export default httpVenta;