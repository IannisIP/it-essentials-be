# ITEssentials be

### Performance analysis

K6 Performance analysis is avaiable here (currently only /products is analysed, but similar performance is expected for the other endpoints):
[https://app.k6.io/runs/public/ecc8570c38f0465dbcf1dccd7e333820]

### Setup

1. mysql -u root -p
   --Enter pw:

2. create databse iteseentials
   Now the db is created.

   use itessentials;
   `show tables;

   CREATE TABLE carts (
   id int NOT NULL AUTO_INCREMENT,
   userId int,
   productId int,
   quantity int,
   created_at datetime,
   updated_at datetime,
   PRIMARY KEY (id)
   );

   CREATE TABLE products (
   id int NOT NULL AUTO_INCREMENT,
   title varchar(150),
   price int,
   image varchar(500),
   description varchar(500),
   created_at datetime,
   updated_at datetime,
   PRIMARY KEY (id)
   );

   INSERT INTO products (title, price, image, description, created_at, updated_at) VALUES
   (
   'Mouse gaming Razer DeathAdder Essential',
   220,
   'https://s13emagst.akamaized.net/products/16892/16891644/images/res_dfef25a7e8bc261567ae0d357137e884.jpg?width=450&height=450&hash=78EF1F7950D206B2DA18FFE55610801F',
   'TODO',
   NOW(),
   NOW()
   );
   INSERT INTO products (title, price, image, description, created_at, updated_at) VALUES
   (
   'Tastatura Hyperx Alloy',
   250,
   'https://s13emagst.akamaized.net/products/27500/27499818/images/res_9db0e81876bc5df75758703264db0eb7.jpg?width=450&height=450&hash=27143FE66DE5EF22252A91195BFCEC94',
   'TODO',
   NOW(),
   NOW()
   );
   INSERT INTO products (title, price, image, description, created_at, updated_at) VALUES
   (
   'Laptop Lenovo',
   4500,
   'https://s13emagst.akamaized.net/products/30931/30930767/images/res_0f8553c11f335f9d176c957fc50324d3.jpg?width=450&height=450&hash=2FC1A2213C6A816EBF4FA9AE11784AFF',
   'TODO',
   NOW(),
   NOW()
   );
   INSERT INTO products (title, price, image, description, created_at, updated_at) VALUES
   (
   'Monitor',
   1500,
   'https://s13emagst.akamaized.net/products/26849/26848685/images/res_7719f04675d1ff48ecfed67ac0758a5d.jpg?width=450&height=450&hash=820300CFFB5792C88C3938743AE1CEAF',
   'TODO',
   NOW(),
   NOW()
   );
   INSERT INTO products (title, price, image, description, created_at, updated_at) VALUES
   (
   'Tastatura Razer',
   200,
   'https://s13emagst.akamaized.net/products/27146/27145356/images/res_4e09efb993ebc1128db729b42497916f.jpg?width=450&height=450&hash=9B0E7F0D995EFEF72588B186FDEEEE75',
   'TODO',
   NOW(),
   NOW()
   );
   INSERT INTO products (title, price, image, description, created_at, updated_at) VALUES
   (
   'Altceva gaming',
   200,
   null,
   'TODO',
   NOW(),
   NOW()
   );`
