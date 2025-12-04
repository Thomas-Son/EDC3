const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res) {
    try {
      // Utiliser l'id de l'utilisateur connecté
      const articleData = {
        ...req.body,
        user: req.user._id,
      };

      const article = await articlesService.create(articleData);
      
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      // Vérifier si l'utilisateur est admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ 
          message: "Accès refusé. Rôle admin requis." 
        });
      }

      const article = await articlesService.update(
        req.params.id,
        req.body
      );

      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }

      req.io.emit("article:update", article);
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      // Vérifier si l'utilisateur est admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ 
          message: "Accès refusé. Rôle admin requis." 
        });
      }

      const article = await articlesService.delete(req.params.id);

      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }

      req.io.emit("article:delete", { id: req.params.id });
      res.json({ message: "Article supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const articles = await articlesService.findAll();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async findById(req, res) {
    try {
      const article = await articlesService.findById(req.params.id);
      
      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ArticlesController();
