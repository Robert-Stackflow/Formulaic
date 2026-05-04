// 验证学号格式：M202XXXXXX 或 D202XXXXXX（M表示硕士，D表示博士，X都是数字）
export function validateStudentId(student_id: string): boolean {
  const pattern = /^[MD]202\d{6}$/;
  return pattern.test(student_id);
}

// 验证邮箱是否为 hust.edu.cn
export function validateHustEmail(email: string): boolean {
  return email.endsWith("@hust.edu.cn");
}

// 验证密码强度
// 必须包含大小写字母、数字和符号，至少8位
export function validatePassword(password: string): {
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
  errors: string[];
} {
  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" = "weak";

  // 长度检查
  if (password.length < 8) {
    errors.push("密码至少需要8位");
  }

  // 大写字母检查
  if (!/[A-Z]/.test(password)) {
    errors.push("密码必须包含大写字母");
  }

  // 小写字母检查
  if (!/[a-z]/.test(password)) {
    errors.push("密码必须包含小写字母");
  }

  // 数字检查
  if (!/\d/.test(password)) {
    errors.push("密码必须包含数字");
  }

  // 特殊符号检查
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("密码必须包含特殊符号");
  }

  const isValid = errors.length === 0;

  // 计算强度
  if (isValid) {
    const hasMultipleTypes = [
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    ].filter(Boolean).length;

    if (password.length >= 12 && hasMultipleTypes >= 4) {
      strength = "strong";
    } else if (password.length >= 10 && hasMultipleTypes >= 3) {
      strength = "medium";
    }
  }

  return { isValid, strength, errors };
}

// 检查敏感词
export function containsSensitiveWords(
  content: string,
  sensitiveWords: Array<{ word: string; is_regex: number; type: string }>
): { found: boolean; matchedWord?: string } {
  for (const sw of sensitiveWords) {
    if (sw.is_regex === 1 || sw.type === "regex") {
      try {
        const regex = new RegExp(sw.word, "i");
        if (regex.test(content)) {
          return { found: true, matchedWord: sw.word };
        }
      } catch (e) {
        console.error(`Invalid regex pattern: ${sw.word}`, e);
      }
    } else {
      // 文本匹配（不区分大小写）
      if (content.toLowerCase().includes(sw.word.toLowerCase())) {
        return { found: true, matchedWord: sw.word };
      }
    }
  }
  return { found: false };
}

// 获取密码强度文本和颜色
export function getPasswordStrengthInfo(password: string): {
  text: string;
  color: string;
} {
  const { strength } = validatePassword(password);

  switch (strength) {
    case "strong":
      return { text: "强", color: "text-fd-success" };
    case "medium":
      return { text: "中", color: "text-fd-warning" };
    default:
      return { text: "弱", color: "text-fd-destructive" };
  }
}
