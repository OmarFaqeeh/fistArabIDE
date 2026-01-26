// src/components/Challenges.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CodeIcon from "@mui/icons-material/Code";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";

import challengesData from "../challengesData";

const API_URL = "/api";

const Challenges = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    // Attempt to load user's language from API based on localStorage userData
    let userId = null;
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      userId =
        userData.id || (userData.email ? userData.email.replace(/[@.]/g, "_") : null);
    } catch {
      userId = null;
    }

    if (userId) {
      fetch(`${API_URL}/users/${encodeURIComponent(userId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.data && data.data.language) {
            const serverLang = data.data.language.toLowerCase();
            setLang(serverLang === "ar" ? "ar" : "en");
          } else {
            setLang("en");
          }
        })
        .catch(() => {
          setLang("en");
        });
    } else {
      setLang("en");
    }
  }, []);

  // Normalize pathId: lowercase, replace underscores/spaces with hyphens, remove invalid chars
  const normalizePath = (id) => {
    if (!id) return "";
    return id
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[_\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  };

  // Resolve a canonical key from possible variants of pathId
  const resolvePathKey = (rawId) => {
    const defaultKey = "introduction-to-js";
    const allKeys = Object.keys(challengesData); // keys present in data file

    if (!rawId) return defaultKey;

    const id = normalizePath(rawId);

    // Direct match first
    if (allKeys.includes(id)) return id;

    // Heuristic mapping based on keywords (covers variants like functions_scope, functions, functionsand scope, Arabic path variants)
    if (id.includes("function") || id.includes("functions") || id.includes("func") || id.includes("scope")) {
      if (allKeys.includes("functions-scope")) return "functions-scope";
      // Arabic variants
      if (id.includes("الدوال") || id.includes("نطاق") || id.includes("الدوال-النطاق")) return "functions-scope";
    }
    if (id.includes("control") || id.includes("flow") || id.includes("control-flow")) {
      if (allKeys.includes("control-flow")) return "control-flow";
      if (id.includes("التحكم") || id.includes("التدفق")) return "control-flow";
    }
    if (id.includes("data") || id.includes("structures") || id.includes("structure") || id.includes("data-structures")) {
      if (allKeys.includes("data-structures")) return "data-structures";
      if (id.includes("هياكل") || id.includes("البيانات")) return "data-structures";
    }
    if (id.includes("intro") || id.includes("introduction") || id.includes("introduction-to-js") || id.includes("introductiontojs")) {
      if (allKeys.includes("introduction-to-js")) return "introduction-to-js";
      if (id.includes("مقدمة") || id.includes("جافاسكريبت") || id.includes("js")) return "introduction-to-js";
    }

    // Try matching by contains or partial matches
    const byContains = allKeys.find((k) => k.includes(id) || id.includes(k));
    if (byContains) return byContains;

    // Fallback to default
    return defaultKey;
  };

  // Determine key reliably
  const dataKey = resolvePathKey(pathId);
  // console.log("raw pathId:", pathId, "-> resolved data key:", dataKey);

  const challenges = challengesData[dataKey] || challengesData["introduction-to-js"];

  const getDifficultyColor = (diff) => {
    if (diff === "Easy") return "success";
    if (diff === "Medium") return "warning";
    return "error";
  };

  const openDetail = (challenge) => {
    setSelectedChallenge(challenge);
    setOpenDialog(true);
  };

  const closeDetail = () => {
    setOpenDialog(false);
    setSelectedChallenge(null);
  };

  const handleInitialize = () => {
    if (!selectedChallenge) return;

    const payload = {
      id: selectedChallenge.id,
      title: selectedChallenge.title ? (selectedChallenge.title[lang] || selectedChallenge.title.en) : "",
      description: selectedChallenge.description
        ? (selectedChallenge.description[lang] || selectedChallenge.description.en)
        : (selectedChallenge.short ? (selectedChallenge.short[lang] || selectedChallenge.short.en) : ""),
      difficulty: selectedChallenge.difficulty,
      starterCode: selectedChallenge.starter,
      expected: selectedChallenge.expected,
      video: selectedChallenge.video,
      pathId: dataKey,
      objectives: selectedChallenge.objectives ? (selectedChallenge.objectives[lang] || selectedChallenge.objectives.en) : [],
      timestamp: Date.now(),
      solution: selectedChallenge.solution || "",
    };

    // Save current challenge to localStorage (editor reads this)
    localStorage.setItem("currentChallenge", JSON.stringify(payload));
    setOpenDialog(false);
    navigate("/editor");
  };

  const getPathTitle = () => {
    if (!dataKey) return lang === "ar" ? "مقدمة في JS" : "Introduction To JS";

    const titles = {
      "introduction-to-js": lang === "ar" ? "مقدمة في JS" : "Introduction To JS",
      "control-flow": lang === "ar" ? "التحكم في التدفق" : "Control Flow",
      "data-structures": lang === "ar" ? "هياكل البيانات" : "Data Structures",
      "functions-scope": lang === "ar" ? "الدوال والنطاق" : "Functions & Scope",
    };

    return titles[dataKey] || dataKey.replace(/-/g, " ");
  };

  const t = {
    return: lang === "ar" ? "عودة" : "Return",
    challenges: lang === "ar" ? "التحديات" : "Challenges",
    overview: lang === "ar" ? "نظرة عامة" : "Overview",
    objectives: lang === "ar" ? "الأهداف" : "Objectives",
    expectedOutput: lang === "ar" ? "الناتج المتوقع" : "Expected Output",
    cancel: lang === "ar" ? "إلغاء" : "Cancel",
    accept: lang === "ar" ? "قبول المهمة → ابدأ" : "Accept Mission → Initialize",
    instructions: lang === "ar" ? "اختر مهمة واضغط Initialize لفتح التفاصيل ثم ابدأ." : "Select a challenge and press Initialize to open details and start.",
    difficultyLabel: lang === "ar" ? "الصعوبة" : "Difficulty",
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/select-path")}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          {t.return}
        </Button>
      </Box>

      <Typography variant="h3" sx={{ mb: 1, textTransform: "capitalize" }}>
        {getPathTitle()} {t.challenges}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t.instructions}
      </Typography>

      <Grid container spacing={3}>
        {challenges.map((ch) => (
          <Grid item xs={12} sm={6} md={3} key={ch.id}>
            <Card
              sx={{
                height: "100%",
                bgcolor: "background.paper",
                border: "1px solid rgba(255,255,255,0.04)",
                transition: "all 0.24s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: (theme) => `0 8px 30px ${theme.palette.primary.main}22`,
                  borderColor: "primary.main",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <CodeIcon color="primary" />
                  <Chip label={ch.difficulty} size="small" color={getDifficultyColor(ch.difficulty)} variant="outlined" />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  {ch.title ? (ch.title[lang] || ch.title.en) : ""}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                  {ch.short ? (ch.short[lang] || ch.short.en) : ""}
                </Typography>

                <Button variant="outlined" fullWidth size="small" onClick={() => openDetail(ch)}>
                  {lang === "ar" ? "ابدأ" : "Initialize"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={closeDetail} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: "background.default", borderRadius: 2 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
              {selectedChallenge?.title ? (selectedChallenge.title[lang] || selectedChallenge.title.en) : ""}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t.difficultyLabel}: {selectedChallenge?.difficulty}
            </Typography>
          </Box>

          <IconButton onClick={closeDetail}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, py: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ bgcolor: "black", borderRadius: 1, overflow: "hidden", minHeight: 220 }}>
              {selectedChallenge?.video ? (
                selectedChallenge.video.includes("youtube.com") || selectedChallenge.video.includes("youtu.be") ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedChallenge.video}
                    title="Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ minHeight: 220 }}
                  />
                ) : (
                  <video width="100%" height="100%" controls style={{ minHeight: 220 }}>
                    <source src={selectedChallenge.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220, color: "text.secondary" }}>
                  <Typography variant="body2">{lang === "ar" ? "لا يوجد فيديو متاح حالياً" : "No video available"}</Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t.overview}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {selectedChallenge
                ? selectedChallenge.description
                  ? (selectedChallenge.description[lang] || selectedChallenge.description.en)
                  : (selectedChallenge.short ? (selectedChallenge.short[lang] || selectedChallenge.short.en) : "")
                : ""}
            </Typography>

            <Box>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                {t.objectives}
              </Typography>
              <ul style={{ marginTop: 0, paddingLeft: 18 }}>
                {selectedChallenge?.objectives
                  ? (selectedChallenge.objectives[lang] || selectedChallenge.objectives.en).map((o, i) => (
                      <li key={i}>
                        <Typography variant="body2">{o}</Typography>
                      </li>
                    ))
                  : null}
              </ul>
            </Box>

            <Box>
              <Typography variant="subtitle2">{t.expectedOutput}</Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace", mt: 0.5 }}>
                {selectedChallenge?.expected}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <DialogActions sx={{ p: 0 }}>
              <Button variant="text" onClick={closeDetail}>
                {t.cancel}
              </Button>
              <Button variant="contained" onClick={handleInitialize} sx={{ bgcolor: "primary.main" }}>
                {t.accept}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Challenges;