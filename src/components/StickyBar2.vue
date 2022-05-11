<template>
    <div class="sticky"> Камеры:
        <input type="submit" value="Въезд" />
        <input type="submit" value="Выезд" />
        <input type="submit" value="Устройство" />
        |
        <input type="radio" id="AutoIn" name="inOrOut" value="in" checked="true" /><label for="AutoIn">Въезд</label>
        <input type="radio" id="AutoOut" name="inOrOut" value="out" /><label for="AutoOut">Выезд</label>
        |
        История:
        <select name="History">
            <option value="_today" selected="true">Сегодня</option>
        </select>
    </div>
</template>

<style scoped>
@import '../css/sticky.css';
</style>