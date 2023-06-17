/**+
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
// import * as ItemService from "./items.service";
import { title } from "process";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import bodyParser from "body-parser";
import multer from "multer"
import path from "path";
import { User } from "../entity/User";
import { TradeMark } from "../entity/Trademark";
import session from 'express-session';
import { Employess } from "../entity/Employee";
import { Costumer } from "../entity/Costumer";

/**
 * Router Definition
 */

var storage = multer.diskStorage({
  destination: './public/image',
  filename: function(req,file,cb){
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
var upload = multer({
  storage:storage
})
AppDataSource.initialize()
    .then(() => {
        console.log("Connect !");
    })
    .catch((error) => console.log("Loi " + error))
export const itemsRouter = express.Router();
/**
 * Controller Definitions
 */
//get trang admin
itemsRouter.get("/login", async (req: Request, res: Response) => {
  try {
      res.render("login", { message: null });
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

itemsRouter.post("/login", async (req: Request, res: Response) => {
  try {
    // const id: number = parseInt(req.params.id, 10);
      const { username, password } = req.body
      const user = await AppDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where('user.username = :username', { username })
        .andWhere('user.password = :password', { password })
        .getOne()

      if(user){
        // req.session.user = user  
        // req.session.user = true
        res.redirect("admin");
        console.log(user);
      }else{
        res.render('login', { message: 'Please enter both username and password.' });
      }
      
      
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

// get trang chu
itemsRouter.get("/", async (req: Request, res: Response) => {
    try {
    //   const items: Item[] = await ItemService.findAll();
    const items = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .getMany();
    res.render("index",{list:items});
      // res.status(200).send(items);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  });
  const reponUser = AppDataSource.getRepository(User)
  //get trang admin
  itemsRouter.get("/admin", async (req: Request, res: Response) => {
    try {
    //   const items: Item[] = await ItemService.findAll();
    const id: number = parseInt(req.params.id, 10);
    const items_P = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .getMany();
    const items_u = await AppDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .getMany();
      const { username, password } = req.body
      // const user = await AppDataSource.manager.find(User);
      const user = reponUser.findOne({
          where:{
            username: username
          }
      })
      // const user = AppDataSource.query(`Select username from user where id = ${req.params.id}`);
      // res.render("admin", {title:"Trang chu",items_p:items_P,items_u:items_u});
      // const token= req.cookies.token;
      if (user) {
        res.render("admin", {title:"Trang chu",items_p:items_P,items_u:items_u,user:user});
        console.log(user);
      }
  
      
      // res.status(200).send(items);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  });
//get trang admin_p
itemsRouter.get("/admin_p", async (req: Request, res: Response) => {
  try {
  //   const items: Item[] = await ItemService.findAll();

    const items = await AppDataSource
      .getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.trademark", "trademark_id")
      .getMany();
      res.render("product/admin_p",{list:items});
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
//get trang trademark
itemsRouter.get("/trademark", async (req: Request, res: Response) => {
  try {
  //   const items: Item[] = await ItemService.findAll();
  const items = await AppDataSource
  .getRepository(TradeMark)
  .createQueryBuilder("trademark")
  .getMany();
  res.render("trademark/trademark",{list:items});
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
itemsRouter.get("/trademark/add_tr", async (req: Request, res: Response) => {
  try {

      res.render("trademark/add_tr");
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
//trang them thuong hieu
itemsRouter.post("/trademark_add", async (req: Request, res: Response) => {
  try {
    const addItem = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(TradeMark)
    .values({
        name: req.body.name,
    })
    .execute()

    res.redirect("trademark");
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

//get trang edit trademark
itemsRouter.get("/edit_trade/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const item = await AppDataSource
    .getRepository(TradeMark)
    .createQueryBuilder("trademark")
    .where("trademark.id = :id",{id:id})
    .getOne();
      res.render("trademark/edit_tr",{item:item})
    // res.sendStatus(204);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

//thuc hien edit
itemsRouter.post("/trademark_edit/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const addItem = await AppDataSource
    .createQueryBuilder()
    .update(TradeMark)
    .set({
        name: req.body.name,
    })
    .where("product.id = :id",{id:id})
    .execute()

    res.redirect("trademark");
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
 //delete
 itemsRouter.get("/delete_trade/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await AppDataSource
  .createQueryBuilder()
  .delete()
  .from(TradeMark)
  .where("id = :id", { id: id })
  .execute()
  return  res.redirect('/trademark');
    // res.sendStatus(204);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
//get trang them sp
itemsRouter.get("/product/add", async (req: Request, res: Response) => {
  try {
    const items = await AppDataSource.manager.find(TradeMark);

      res.render("product/add_p",{items});
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

//thuc hien them sp
itemsRouter.post("/product/add", upload.single("image") ,async (req: Request, res: Response) => {
  try {
    const addItem = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Product)
    .values({
        name: req.body.name,
        description: req.body.description,
        gender: req.body.gender,
        trademark: req.body.trademark_id,
        price: req.body.price,
        image: req.file.filename
    })
    .execute()
    res.redirect('/admin_p');
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
// GET items/detail/:id
itemsRouter.get("/product/detail/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.trademark", "trademark_id")
    .where("product.id = :id",{id:id})
    .getOne();

    if (item) {
      // return res.status(200).send(item);
      return res.render("product/detail_p",{item:item});
    }

    // return res.status(404).send("item not found");
  } catch (e:any) {
    return res.status(500).send(e.message);
  }
});
  
itemsRouter.get("/product/edit/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const items = await AppDataSource.manager.find(TradeMark);
    const item = await AppDataSource
    .getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.trademark", "trademark_id")
    .where("product.id = :id",{id:id})
    .getOne();

    if (item) {
      // return res.status(200).send(item);
      return res.render("product/edit_p",{item:item,items:items});
    }

    // return res.status(404).send("item not found");
  } catch (e:any) {
    return res.status(500).send(e.message);
  }
});

// PUT items/:id
itemsRouter.post("/product/update/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    // console.log(req.body.name)
    try {
      const updatedItem = await AppDataSource
        .createQueryBuilder()
        .update(Product)
        .set({ 
          name: req.body.name,
          description: req.body.description,
          gender: req.body.gender,
          trademark: req.body.trademark,
          price: req.body.price,
          // image: req.file.filename
        })
        .where('id = :id',{id:id}).execute();
        return res.redirect('/admin_p');
      
    } 
    catch (e:any) {
      return res.status(500).send(e.message);
    }
  });
// DELETE items/:id
itemsRouter.get("/product/delete/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await AppDataSource
  .createQueryBuilder()
  .delete()
  .from(Product)
  .where("id = :id", { id: id })
  .execute()
  return  res.redirect('/admin_p');
    // res.sendStatus(204);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
//USER

//get admin_user
itemsRouter.get("/admin_user", async (req: Request, res: Response) => {
  try {
  //   const items: Item[] = await ItemService.findAll();

    const items = await AppDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .getMany();
      res.render("user/admin_user",{list:items});
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

//get admin_add
itemsRouter.get("/add_user", async (req: Request, res: Response) => {
  try {
      res.render("user/add_user");
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

//thuc hien them 
itemsRouter.post("/add_user", async (req: Request, res: Response) => {
    try {
      const addItem = await AppDataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email
      })
      .execute()
      res.redirect('/admin_user');
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

itemsRouter.get("/edit_user/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id",{id:id})
    .getOne();

    if (item) {
      // return res.status(200).send(item);
      return res.render("user/edit_user",{item:item});
    }

    // return res.status(404).send("item not found");
  } catch (e:any) {
    return res.status(500).send(e.message);
  }
});

// PUT items/:id
itemsRouter.post("/update_user/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    console.log(req.body.name)
    try {
      const updatedItem = await AppDataSource
        .createQueryBuilder()
        .update(User)
        .set({ 
          username: req.body.username,
          password: req.body.password,
          email: req.body.email
          // image: req.file.filename
        })
        .where('id = :id',{id:id}).execute();
        return res.redirect('/admin_user');
      
    } 
    catch (e:any) {
      return res.status(500).send(e.message);
    }
  });
//delete
  itemsRouter.get("/delete_user/:id", async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: id })
    .execute()
    return  res.redirect('/admin_user');
      // res.sendStatus(204);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  });

  //get trang admin_employee
  itemsRouter.get("/admin_e", async (req: Request, res: Response) => {
    try {
    //   const items: Item[] = await ItemService.findAll();
  
      const items = await AppDataSource
        .getRepository(Employess)
        .createQueryBuilder("employess")
        .getMany();
      res.render("employee/admin_e",{list:items});
      // res.status(200).send(items);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  });

  //get trang them nv
  itemsRouter.get("/add_e", async (req: Request, res: Response) => {
    try {
        res.render("employee/add_e");
      // res.status(200).send(items);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  });
//thuc hien them nv
  itemsRouter.post("/add_e", async (req: Request, res: Response) => {
    try {
      const addItem = await AppDataSource
      .createQueryBuilder()
      .insert()
      .into(Employess)
      .values({
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone
      })
      .execute()
      res.redirect('/admin_e');
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

itemsRouter.get("/edit_e/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const item = await AppDataSource
    .getRepository(Employess)
    .createQueryBuilder("employess")
    .where("employess.id = :id",{id:id})
    .getOne();

    if (item) {
      // return res.status(200).send(item);
      return res.render("employee/edit_e",{item:item});
    }

    // return res.status(404).send("item not found");
  } catch (e:any) {
    return res.status(500).send(e.message);
  }
});

// PUT items/:id
itemsRouter.post("/update_e/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    console.log(req.body.name)
    try {
      const updatedItem = await AppDataSource
        .createQueryBuilder()
        .update(Employess)
        .set({ 
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone
        })
        .where('id = :id',{id:id}).execute();
        return res.redirect('/admin_e');
      
    } 
    catch (e:any) {
      return res.status(500).send(e.message);
    }
  });

  //delete
  itemsRouter.get("/delete_e/:id", async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(Employess)
    .where("id = :id", { id: id })
    .execute()
    return  res.redirect('/admin_e');
      // res.sendStatus(204);
    } catch (e:any) {
      res.status(500).send(e.message);
    }
  });


//get trang danh sach thong tin khach hang

itemsRouter.get("/admin_c", async (req: Request, res: Response) => {
  try {
  //   const items: Item[] = await ItemService.findAll();

    const items = await AppDataSource
      .getRepository(Costumer)
      .createQueryBuilder("costumer")
      .getMany();
    res.render("costumer/admin_c",{list:items});
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});

 //get trang them nv
 itemsRouter.get("/add_c", async (req: Request, res: Response) => {
  try {
      res.render("costumer/add_c");
    // res.status(200).send(items);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});
//thuc hien them nv
itemsRouter.post("/add_c", async (req: Request, res: Response) => {
  try {
    const addItem = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Costumer)
    .values({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    })
    .execute()
    res.redirect('/admin_c');
} catch (e:any) {
  res.status(500).send(e.message);
}
});

itemsRouter.get("/edit_c/:id", async (req: Request, res: Response) => {
const id: number = parseInt(req.params.id, 10);

try {
  const item = await AppDataSource
  .getRepository(Costumer)
  .createQueryBuilder("costumer")
  .where("costumer.id = :id",{id:id})
  .getOne();

  if (item) {
    // return res.status(200).send(item);
    return res.render("costumer/edit_c",{item:item});
  }

  // return res.status(404).send("item not found");
} catch (e:any) {
  return res.status(500).send(e.message);
}
});

// PUT items/:id
itemsRouter.post("/update_c/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  console.log(req.body.name)
  try {
    const updatedItem = await AppDataSource
      .createQueryBuilder()
      .update(Costumer)
      .set({ 
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
      })
      .where('costumer.id = :id',{id:id}).execute();
      return res.redirect('/admin_c');
    
  } 
  catch (e:any) {
    return res.status(500).send(e.message);
  }
});

//delete
itemsRouter.get("/delete_c/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await AppDataSource
  .createQueryBuilder()
  .delete()
  .from(Costumer)
  .where("id = :id", { id: id })
  .execute()
  return  res.redirect('/admin_c');
    // res.sendStatus(204);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});