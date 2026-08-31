"""줄바꿈 시 단어(어절)가 잘리지 않도록 슬라이드 XML을 손봅니다.

DrawingML 문단 속성 a:pPr 의 eaLnBrk="0" 은 한글·한자 등 동아시아 문자를
낱글자 단위로 끊지 말라는 뜻이고, latinLnBrk="0" 은 영문 단어를 끊지
말라는 뜻입니다. pptxgenjs 는 두 속성을 노출하지 않으므로 생성된 패키지의
slideN.xml 을 직접 고칩니다. 네임스페이스 접두사가 바뀌지 않도록 XML 파서
대신 문자열 치환만 사용합니다.
"""
import re
import shutil
import sys
import zipfile

ATTRS = ' eaLnBrk="0" latinLnBrk="0"'


def fix_xml(xml: str) -> str:
    # 이미 pPr 가 있는 문단: 속성만 덧붙인다 (중복 방지)
    xml = re.sub(r"<a:pPr(?![^>]*eaLnBrk)", "<a:pPr" + ATTRS, xml)
    # pPr 가 없는 문단: 비어 있는 pPr 를 만들어 넣는다
    xml = re.sub(r"<a:p>(?!<a:pPr)", '<a:p><a:pPr' + ATTRS + "/>", xml)
    return xml


def main(src: str, dst: str) -> None:
    if src != dst:
        shutil.copyfile(src, dst)
    zin = zipfile.ZipFile(src)
    items = [(i, zin.read(i.filename)) for i in zin.infolist()]
    zin.close()

    touched = 0
    with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for info, data in items:
            if re.fullmatch(r"ppt/slides/slide\d+\.xml", info.filename):
                fixed = fix_xml(data.decode("utf-8")).encode("utf-8")
                if fixed != data:
                    touched += 1
                data = fixed
            zout.writestr(info, data)
    print(f"line-break fix applied to {touched} slide(s) -> {dst}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else sys.argv[1])
