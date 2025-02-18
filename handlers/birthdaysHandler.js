const { getBirthdays } = require("../controllers/birthdaysController");

const getProximosCumpleanosHandler = async (req, res) => {
    const { desde, hasta } = req.query;

    try {
        const birthdays = await getBirthdays({ desde, hasta });
        res.status(200).json(birthdays);
    } catch (error) {
        res.status(400).json({
            message: error.message,
            statusCode: 400,
        });
    }
};

module.exports = {
    getProximosCumpleanosHandler,
};
