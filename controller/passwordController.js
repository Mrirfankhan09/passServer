import Password from "../models/Password.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import Activity from "../models/Activity.js";

export const addPassword = async (req, res) => {
    try {
        const { title, usernameOrEmail, Password: plainPassword, category } = req.body;
        // console.log(title, usernameOrEmail, plainPassword, category)

        // console.log(req.user)
        const user = req.user.userId;
        // console.log("User ID:", user);
        const encryptedPassword = encrypt(plainPassword);


        const storedpassword = new Password({
            user,
            title,
            usernameOrEmail,
            password: encryptedPassword,
            category,
        });

        await storedpassword.save();
        await Activity.create({
            userId: user,
            action: "added",
            target: `password for ${title}`
        });

        res.status(201).json({ message: "Password added successfully", success: true, });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getpasswordById = async (req, res) => {

    try {
        const user = req.user.userId;

        const passwordId = req.params.id;
        // console.log('param', passwordId)
        const storedpassword = await Password.findById(passwordId);

        // console.log("Stored Password:", storedpassword);
        // console.log(storedpassword)
        if (!storedpassword) {
            return res.status(404).json({ message: "Password not found", success: false });
        }
        if (storedpassword.user.toString() !== user.toString()) {
            return res.status(403).json({ message: "Unauthorized access", success: false });
        }
        const decryptedPassword = decrypt(storedpassword.password);
        console.log("Decrypted Password:", decryptedPassword);
        res.json({ ...storedpassword.toObject(), password: decryptedPassword, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const user = req.user.userId;
        const passwordId = req.params.id;
        const { title, usernameOrEmail, password: plainPassword, category } = req.body;
        console.log(plainPassword, 'plain')

        // Find stored password
        const storedpassword = await Password.findById(passwordId);
        if (!storedpassword) {
            return res.status(404).json({ message: "Password not found", success: false });
        }

        // Ensure ownership
        if (storedpassword.user.toString() !== user.toString()) {
            return res.status(403).json({ message: "Unauthorized access", success: false });
        }

        // Track all changes
        const changes = [];

        if (title && title !== storedpassword.title) {
            storedpassword.title = title;
            changes.push("title");
        }
        if (usernameOrEmail && usernameOrEmail !== storedpassword.usernameOrEmail) {
            storedpassword.usernameOrEmail = usernameOrEmail;
            changes.push("username/email");
        }

        // Handle password safely

        if (typeof plainPassword === "string" && plainPassword.trim() !== "") {

            // Case 1: user sent back the same encrypted password by mistake
            if (plainPassword === storedpassword.password) {
                // password unchanged, do nothing
            } else {
                // Case 2: new plain password (or decrypted value sent back)
                const oldPlain = decrypt(storedpassword.password);
                if (plainPassword !== oldPlain) {
                    storedpassword.password = encrypt(plainPassword); // encrypt new password
                    changes.push("password");
                }
                // else: user typed the same password as before → no change
            }
        }



        if (category && category !== storedpassword.category) {
            storedpassword.category = category;
            changes.push("category");
        }

        // Save updates
        await storedpassword.save();

        // Create activities for all changes
        if (changes.length > 0) {
            const activityLogs = changes.map(field => ({
                userId: user,
                action: "updated",
                target: `${field} for ${storedpassword.title}`
            }));
            await Activity.insertMany(activityLogs);
        }

        res.json({ message: "Password updated successfully", success: true, changes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};



export const deletePassword = async (req, res) => {
    try {
        const user = req.user.userId;
        const passwordId = req.params.id;

        const storedpassword = await Password.findById(passwordId);
        if (!storedpassword) {
            return res.status(404).json({ message: "Password not found", success: false });
        }
        if (storedpassword.user.toString() !== user.toString()) {
            return res.status(403).json({ message: "Unauthorized access", success: false });
        }

        await Password.deleteOne({ _id: passwordId });

        // Log activity correctly
        await Activity.create({
            userId: user,
            action: "deleted",
            target: `password for ${storedpassword.title}`,
            timestamp: new Date()
        });

        res.json({ message: "Password deleted successfully", success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAllPasswords = async (req, res) => {
    try {
        const user = req.user.userId;
        const passwords = await Password.find({ user });
        res.json(passwords);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
}

